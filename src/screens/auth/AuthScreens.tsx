import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputInstance, type TextInputProps, View} from 'react-native';
import {ApiError, auth} from '../../api/client';
import {authApi, type Organisation} from '../../api/endpoints';
import type {User} from '../../api/types';
import {RoundButton} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {AppleLogo, GoogleLogo} from '../../components/BrandLogos';
import {TitleBar} from '../../components/Layout';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 30;

function describe(error: unknown) {
  return error instanceof ApiError ? error.message : 'Can\'t reach yizelearn right now. Check your connection and try again.';
}

// Google and Apple sign-in need their SDKs and provider keys. Until those are set up, the buttons say so.
function notConnected(provider: string) {
  Alert.alert(provider, `${provider} sign-in is not connected yet. Use your email for now.`);
}

type LoginProps = {onBack?: () => void; onSignUp: () => void; onSso: () => void; onSent: (email: string) => void};
export function LoginScreen({onBack, onSignUp, onSso, onSent}: LoginProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = EMAIL.test(email.trim());

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError('');
    try {
      await authApi.requestCode(email.trim());
      onSent(email.trim());
    } catch (e) {
      setError(describe(e));
    } finally {
      setBusy(false);
    }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {onBack && <View style={styles.backRow}><RoundButton icon="back" onPress={onBack} label="Back" /></View>}
    <BrandLogo />
    <Text style={[styles.title, font]}>Welcome back</Text>
    <Text style={[styles.subtitle, font]}>Log in to keep learning</Text>

    <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
    {!!error && <Text style={[styles.error, font]}>{error}</Text>}
    <Primary label="Log in" disabled={!valid} busy={busy} onPress={submit} />

    <Divider label="or continue with" />
    <View style={styles.social}>
      <SocialButton label="Google" logo={<GoogleLogo />} onPress={() => notConnected('Google')} />
      {Platform.OS === 'ios' && <SocialButton label="Apple" logo={<AppleLogo color={colors.ink} />} onPress={() => notConnected('Apple')} />}
    </View>

    <Pressable onPress={onSso} style={({pressed}) => [styles.sso, pressed && styles.pressed]} accessibilityRole="button">
      <Text style={[styles.ssoText, font]}>Log in with school or work SSO</Text>
    </Pressable>

    <Text style={[styles.footer, font]}>New here? <Text onPress={onSignUp} style={styles.link}>Create an account</Text></Text>
  </ScrollView>;
}

type SignUpProps = {onBack: () => void; onLogin: () => void; onSent: (email: string, name: string) => void};
export function SignUpScreen({onBack, onLogin, onSent}: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const ready = name.trim().length >= 2 && EMAIL.test(email.trim()) && agreed;

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      await authApi.requestCode(email.trim(), name.trim());
      onSent(email.trim(), name.trim());
    } catch (e) {
      setError(describe(e));
    } finally {
      setBusy(false);
    }
  };

  return <View style={styles.screen}>
    <TitleBar title="Create account" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <BrandLogo />
      <Field label="Full name" value={name} onChangeText={setName} placeholder="Your full name" autoCapitalize="words" autoComplete="name" textContentType="name" />
      <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <Pressable onPress={() => setAgreed(v => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{checked: agreed}}>
        <View style={[styles.box, agreed && styles.boxOn]}>{agreed && <Icon name="check" size={16} color={colors.onSky} />}</View>
        <Text style={[styles.checkText, font]}>I agree to the Terms and Privacy policy</Text>
      </Pressable>
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Primary label="Create account" disabled={!ready} busy={busy} onPress={submit} />

      <Divider label="or sign up with" />
      <View style={styles.social}>
        <SocialButton label="Google" logo={<GoogleLogo />} onPress={() => notConnected('Google')} />
        {Platform.OS === 'ios' && <SocialButton label="Apple" logo={<AppleLogo color={colors.ink} />} onPress={() => notConnected('Apple')} />}
      </View>

      <Text style={[styles.footer, font]}>Already have an account? <Text onPress={onLogin} style={styles.link}>Log in</Text></Text>
    </ScrollView>
  </View>;
}

type VerifyProps = {email: string; name?: string; onBack: () => void; onVerified: (user: User) => void};
export function VerifyCodeScreen({email, name, onBack, onVerified}: VerifyProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const verify = async (value: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await authApi.verifyCode(email, value);
      auth.setToken(result.token);
      onVerified(result.user);
    } catch (e) {
      setError(describe(e));
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (wait > 0) return;
    setError('');
    try {
      await authApi.requestCode(email, name);
      setWait(RESEND_SECONDS);
    } catch (e) {
      setError(describe(e));
    }
  };

  return <View style={styles.screen}>
    <View style={styles.backRow}><RoundButton icon="back" onPress={onBack} label="Back" /></View>
    <View style={styles.codeWrap}>
      <Text style={[styles.title, font]}>Enter the code</Text>
      <Text style={[styles.subtitle, font]}>We sent a 6-digit code to{'\n'}<Text style={styles.emailText}>{email}</Text></Text>
      <CodeInput value={code} onChange={setCode} onComplete={verify} />
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Primary label="Verify" disabled={code.length !== 6} busy={busy} onPress={() => verify(code)} />
      <Pressable onPress={resend} disabled={wait > 0} style={styles.resend} accessibilityRole="button" accessibilityState={{disabled: wait > 0}}>
        <Text style={[styles.resendText, font, wait > 0 && styles.muted]}>{wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}</Text>
      </Pressable>
    </View>
  </View>;
}

// Six boxes that fill as you type. One hidden input does the typing, so the keyboard and autofill work as usual.
function CodeInput({value, onChange, onComplete}: {value: string; onChange: (value: string) => void; onComplete: (value: string) => void}) {
  const input = useRef<TextInputInstance>(null);
  return <Pressable onPress={() => input.current?.focus()} style={styles.codeRow} accessibilityLabel="Enter the 6-digit code">
    {Array.from({length: 6}, (_, i) => <View key={i} style={[styles.codeBox, i === value.length && styles.codeBoxActive]}><Text style={[styles.codeDigit, font]}>{value[i] ?? ''}</Text></View>)}
    <TextInput ref={input} value={value} autoFocus maxLength={6} keyboardType="number-pad" autoComplete="sms-otp" textContentType="oneTimeCode"
      onChangeText={text => { const digits = text.replace(/\D/g, '').slice(0, 6); onChange(digits); if (digits.length === 6) onComplete(digits); }}
      style={styles.hiddenInput} />
  </Pressable>;
}

type FieldProps = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'textContentType'> & {label: string};
function Field({label, ...input}: FieldProps) {
  return <View style={styles.field}>
    <Text style={[styles.label, font]}>{label}</Text>
    <TextInput {...input} placeholderTextColor={colors.muted} style={[styles.input, font]} />
  </View>;
}

function Primary({label, onPress, disabled, busy}: {label: string; onPress: () => void; disabled?: boolean; busy?: boolean}) {
  return <Pressable onPress={onPress} disabled={disabled || busy} accessibilityRole="button" accessibilityState={{disabled: disabled || busy, busy}}
    style={({pressed}) => [styles.primary, (disabled && !busy) && styles.dim, pressed && styles.pressed]}>
    {busy ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.primaryText, font]}>{label}</Text>}
  </Pressable>;
}

function SocialButton({label, logo, onPress}: {label: string; logo: React.ReactNode; onPress: () => void}) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Continue with ${label}`} style={({pressed}) => [styles.socialButton, pressed && styles.pressed]}>
    {logo}
    <Text style={[styles.socialText, font]}>{label}</Text>
  </Pressable>;
}

function BrandLogo() {
  return <Image source={require('../../assets/brand/logo.png')} style={styles.logoImage} resizeMode="contain" accessibilityLabel="yizelearn" />;
}

function Divider({label}: {label: string}) {
  return <View style={styles.divider}><View style={styles.rule} /><Text style={[styles.dividerText, font]}>{label}</Text><View style={styles.rule} /></View>;
}

type SsoProps = {onBack: () => void; onEmailLogin: () => void; onSignedIn: (user: User) => void};
type SsoStep = 'email' | 'confirm' | 'signing';
const SIGNING_STEPS = ['Opening your organisation’s sign-in', 'Checking your account', 'Setting up yizelearn'];

/** School or work SSO: find the organisation from the email, confirm it, then sign in through its identity provider. */
export function SsoScreen({onBack, onEmailLogin, onSignedIn}: SsoProps) {
  const [step, setStep] = useState<SsoStep>('email');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState<Organisation | undefined>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = EMAIL.test(email.trim());

  const find = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError('');
    try {
      setOrg(await authApi.ssoLookup(email.trim()));
      setStep('confirm');
    } catch (e) {
      setError(describe(e));
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    if (!org) return;
    setStep('signing');
    try {
      const result = await authApi.ssoSignIn(org.id, email.trim());
      auth.setToken(result.token);
      onSignedIn(result.user);
    } catch (e) {
      setError(describe(e));
      setStep('confirm');
    }
  };

  const back = step === 'confirm' ? () => { setStep('email'); setError(''); } : onBack;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {step !== 'signing' && <View style={styles.backRow}><RoundButton icon="back" onPress={back} label="Back" /></View>}
    {step === 'email' && <FadeIn key="email">
      <SsoArt icon="shield" />
      <Text style={[styles.title, font]}>Log in with SSO</Text>
      <Text style={[styles.subtitle, font]}>Use the email your school or employer gave you.{'\n'}We’ll find your organisation.</Text>
      <Field label="School or work email" value={email} onChangeText={t => { setEmail(t); setError(''); }} placeholder="you@school.edu.ng" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Primary label="Find my organisation" disabled={!valid} busy={busy} onPress={find} />
      <Text style={[styles.footer, font]}>No SSO? <Text onPress={onEmailLogin} style={styles.link}>Log in with an email code</Text></Text>
    </FadeIn>}
    {step === 'confirm' && org && <FadeIn key="confirm">
      <SsoArt icon={org.kind === 'school' ? 'school' : 'building'} />
      <Text style={[styles.title, font]}>We found it</Text>
      <Text style={[styles.subtitle, font]}>You’ll sign in on {org.name}’s page,{'\n'}then come straight back here.</Text>
      <View style={styles.orgCard}>
        <View style={styles.orgBadge}><Text style={[styles.orgInitials, font]}>{initials(org.name)}</Text></View>
        <View style={styles.orgCopy}>
          <Text style={[styles.orgName, font]} numberOfLines={1}>{org.name}</Text>
          <Text style={[styles.orgMeta, font]} numberOfLines={1}>{org.domain} · {org.kind === 'school' ? 'School' : 'Work'}</Text>
        </View>
        <Icon name="check" size={22} color={colors.blue700} />
      </View>
      <View style={styles.orgNote}>
        <Icon name="lock" size={18} color={colors.muted} />
        <Text style={[styles.orgNoteText, font]}>{org.provider === 'your organisation' ? 'Your organisation handles sign-in' : `Signs in with ${org.provider}`}. yizelearn never sees your password.</Text>
      </View>
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Primary label={`Continue to ${org.name}`} onPress={signIn} />
      <Pressable onPress={back} style={styles.resend} accessibilityRole="button"><Text style={[styles.resendText, font]}>Not your organisation? Use another email</Text></Pressable>
    </FadeIn>}
    {step === 'signing' && org && <FadeIn key="signing" style={styles.signing}>
      <SsoArt icon="shield" pulse />
      <Text style={[styles.title, font]}>Signing you in</Text>
      <Text style={[styles.subtitle, font]}>Connecting to {org.name}</Text>
      <SigningSteps />
    </FadeIn>}
  </ScrollView>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2) || name.slice(0, 2).toUpperCase();
}

/** Each step of the content fades and lifts in, so moving between steps feels like one flow. */
function FadeIn({children, style}: {children: React.ReactNode; style?: object}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, {toValue: 1, duration: 420, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true}).start(); }, [t]);
  return <Animated.View style={[style, {opacity: t, transform: [{translateY: t.interpolate({inputRange: [0, 1], outputRange: [16, 0]})}]}]}>{children}</Animated.View>;
}

/** The icon in soft rings used across the app's illustrations; `pulse` sends rings outward while work is in progress. */
function SsoArt({icon, pulse}: {icon: 'shield' | 'school' | 'building'; pulse?: boolean}) {
  const pop = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(pop, {toValue: 1, friction: 6, tension: 70, useNativeDriver: true}).start();
    if (!pulse) return;
    const loop = Animated.loop(Animated.timing(wave, {toValue: 1, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true}));
    loop.start();
    return () => loop.stop();
  }, [pop, wave, pulse]);
  return <View style={styles.ssoArt}>
    {pulse && <Animated.View style={[styles.ssoWave, {opacity: wave.interpolate({inputRange: [0, 1], outputRange: [0.5, 0]}), transform: [{scale: wave.interpolate({inputRange: [0, 1], outputRange: [1, 1.6]})}]}]} />}
    <Animated.View style={[styles.ssoOuter, {transform: [{scale: pop.interpolate({inputRange: [0, 1], outputRange: [0.7, 1]})}]}]}>
      <View style={styles.ssoInner}><Icon name={icon} size={34} color={colors.blue700} /></View>
    </Animated.View>
    <View style={styles.ssoDotGold} />
    <View style={styles.ssoDotBlue} />
    <View style={styles.ssoRing} />
  </View>;
}

function SigningSteps() {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= SIGNING_STEPS.length) return;
    const timer = setTimeout(() => setDone(d => d + 1), 750);
    return () => clearTimeout(timer);
  }, [done]);
  return <View style={styles.steps}>{SIGNING_STEPS.map((label, i) => <View key={label} style={styles.stepRow}>
    <View style={[styles.stepDot, i < done && styles.stepDotDone]}>
      {i < done ? <Icon name="check" size={14} color={colors.white} /> : i === done ? <ActivityIndicator size="small" color={colors.blue700} /> : null}
    </View>
    <Text style={[styles.stepText, font, i > done && styles.muted]}>{label}</Text>
  </View>)}</View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 32},
  backRow: {alignItems: 'flex-start', marginBottom: 4},
  logoImage: {width: 154, height: 48, alignSelf: 'center', marginTop: 12, marginBottom: 24},
  title: {fontSize: type.display - 2, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  subtitle: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 22},
  field: {marginBottom: 18},
  label: {fontSize: type.small, color: colors.ink, fontWeight: '700', marginBottom: 8},
  input: {height: 58, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18, fontSize: type.body, color: colors.ink},
  error: {fontSize: type.caption, color: colors.danger, marginBottom: 10, textAlign: 'center'},
  primary: {height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center', marginTop: 4},
  primaryText: {fontSize: type.subheading, color: colors.onSky, fontWeight: '700'},
  dim: {opacity: 0.5},
  pressed: {opacity: 0.8},
  divider: {flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 26},
  rule: {flex: 1, height: 1, backgroundColor: colors.sandLine},
  dividerText: {fontSize: type.caption, color: colors.muted},
  social: {flexDirection: 'row', gap: 12},
  socialButton: {flex: 1, height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  socialText: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  sso: {height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 12},
  ssoText: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  footer: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 26},
  link: {color: colors.blue700, fontWeight: '700'},
  check: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, marginBottom: 8},
  box: {width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {flex: 1, fontSize: type.label, color: colors.ink},
  codeWrap: {flex: 1, paddingHorizontal: spacing.screen, paddingTop: 24},
  emailText: {color: colors.ink, fontWeight: '700'},
  codeRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 24},
  codeBox: {width: 46, height: 58, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  codeBoxActive: {borderColor: colors.sky, borderWidth: 2},
  codeDigit: {fontSize: type.heading, color: colors.ink, fontWeight: '800'},
  hiddenInput: {position: 'absolute', width: 1, height: 1, opacity: 0},
  resend: {alignSelf: 'center', marginTop: 22, padding: 8},
  resendText: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
  muted: {color: colors.muted},
  ssoArt: {width: 140, height: 130, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 18},
  ssoOuter: {width: 108, height: 108, borderRadius: 54, backgroundColor: colors.blue50, alignItems: 'center', justifyContent: 'center'},
  ssoInner: {width: 74, height: 74, borderRadius: 37, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  ssoWave: {position: 'absolute', width: 108, height: 108, borderRadius: 54, backgroundColor: colors.blue100},
  ssoDotGold: {position: 'absolute', top: 10, right: 18, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.marigold},
  ssoDotBlue: {position: 'absolute', top: 14, left: 22, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.blue700},
  ssoRing: {position: 'absolute', bottom: 16, right: 10, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.blue700},
  orgCard: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.sky, backgroundColor: colors.white},
  orgBadge: {width: 48, height: 48, borderRadius: 12, backgroundColor: colors.blue900, alignItems: 'center', justifyContent: 'center'},
  orgInitials: {fontSize: type.label, color: colors.white, fontWeight: '800'},
  orgCopy: {flex: 1},
  orgName: {fontSize: type.body, color: colors.ink, fontWeight: '800'},
  orgMeta: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  orgNote: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, marginBottom: 22, paddingHorizontal: 4},
  orgNoteText: {flex: 1, fontSize: type.caption, color: colors.muted, lineHeight: 18},
  signing: {paddingTop: 48},
  steps: {alignSelf: 'center', gap: 16, marginTop: 4},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  stepDot: {width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.sandLine, alignItems: 'center', justifyContent: 'center'},
  stepDotDone: {backgroundColor: colors.blue700, borderColor: colors.blue700},
  stepText: {fontSize: type.label, color: colors.ink},
});
