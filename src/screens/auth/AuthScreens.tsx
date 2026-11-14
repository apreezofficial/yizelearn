import React, {useEffect, useRef, useState} from 'react';
import {BrandMark} from '../../components/BrandLogo';
import {ActivityIndicator, Alert, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputInstance, type TextInputProps, View} from 'react-native';
import {ApiError} from '../../api/client';
import {authApi, type Organisation} from '../../api/endpoints';
import type {User} from '../../api/types';
import {RoundButton} from '../../components/Catalog';
import {Notice} from '../../components/States';
import {Icon} from '../../components/Icon';
import {AppleLogo, GoogleLogo} from '../../components/BrandLogos';
import {TitleBar} from '../../components/Layout';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_SECONDS = 30;

function describe(error: unknown) {
  return error instanceof ApiError ? error.message : 'Can\'t reach yizelearn right now. Check your connection and try again.';
}

// Google and Apple sign-in need their SDKs and provider keys. Until those are set up, the buttons say so.
function notConnected(provider: string) {
  Alert.alert(provider, `${provider} sign-in is not connected yet. Use your email for now.`);
}

type LoginProps = {onBack?: () => void; onSignUp: () => void; onSso: () => void; onForgot: () => void; onSignedIn: (user: User) => void; onNeedsEmailCode: (email: string) => void; onTwoStep: (challengeToken: string) => void};
export function LoginScreen({onBack, onSignUp, onSso, onForgot, onSignedIn, onNeedsEmailCode, onTwoStep}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const valid = EMAIL.test(email.trim());
  const emailError = touched && email.trim() && !valid ? 'Enter a full email address, like name@example.com' : undefined;
  const ready = valid && password.length > 0;

  const submit = async () => {
    setTouched(true);
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await authApi.logIn(email.trim(), password);
      if (result.status === 'two-step') onTwoStep(result.challengeToken);
      else onSignedIn(result.user);
    } catch (e) {
      // An account that never confirmed its email gets a fresh code and goes to the code screen.
      if (e instanceof ApiError && e.code === 'email_not_verified') { authApi.resendCode(email.trim()).catch(() => {}); onNeedsEmailCode(email.trim()); }
      else setError(describe(e));
    } finally {
      setBusy(false);
    }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {onBack && <View style={styles.backRow}><RoundButton icon="back" onPress={onBack} label="Back" /></View>}
    <BrandLogo />
    <Text style={[font, styles.title]}>Welcome back</Text>
    <Text style={[font, styles.subtitle]}>Log in to keep learning</Text>

    {!!error && <View style={styles.notice}><Notice tone="danger" title="We couldn't log you in" message={error} /></View>}
    <Field label="Email" value={email} onChangeText={v => { setEmail(v); setError(''); }} onBlur={() => setTouched(true)} error={emailError} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
    <Field label="Password" value={password} onChangeText={v => { setPassword(v); setError(''); }} onSubmitEditing={submit} placeholder="Your password" secureTextEntry autoCapitalize="none" autoComplete="current-password" textContentType="password" />
    <Pressable onPress={onForgot} style={styles.forgot} accessibilityRole="button"><Text style={[font, styles.link]}>Forgot password?</Text></Pressable>
    <Primary label="Log in" disabled={!ready} busy={busy} onPress={submit} />

    <Divider label="or continue with" />
    <View style={styles.social}>
      <SocialButton label="Google" logo={<GoogleLogo />} onPress={() => notConnected('Google')} />
      {Platform.OS === 'ios' && <SocialButton label="Apple" logo={<AppleLogo color={colors.ink} />} onPress={() => notConnected('Apple')} />}
    </View>

    <Pressable onPress={onSso} style={({pressed}) => [styles.sso, pressed && styles.pressed]} accessibilityRole="button">
      <Text style={[font, styles.ssoText]}>Log in with school or work SSO</Text>
    </Pressable>

    <Text style={[font, styles.footer]}>New here? <Text onPress={onSignUp} style={styles.link}>Create an account</Text></Text>
  </ScrollView>;
}

type SignUpProps = {onBack: () => void; onLogin: () => void; onSent: (email: string, name: string) => void};
export function SignUpScreen({onBack, onLogin, onSent}: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const passwordOk = password.length >= 8 && password.trim().toLowerCase() !== email.trim().toLowerCase();
  const ready = name.trim().length >= 2 && EMAIL.test(email.trim()) && passwordOk && agreed;

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    setFields({});
    try {
      await authApi.signUp({fullName: name.trim(), email: email.trim(), password});
      onSent(email.trim(), name.trim());
    } catch (e) {
      setError(describe(e));
      if (e instanceof ApiError && e.details) setFields(e.details);
    } finally {
      setBusy(false);
    }
  };

  return <View style={styles.screen}>
    <TitleBar title="Create account" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <BrandLogo />
      <Field label="Full name" value={name} onChangeText={setName} placeholder="Your full name" autoCapitalize="words" autoComplete="name" textContentType="name" error={fields.fullName?.[0]} />
      <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={fields.email?.[0]} />
      <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" error={fields.password?.[0] ?? (password && !passwordOk ? 'Use at least 8 characters, and not your email address.' : undefined)} />
      <Pressable onPress={() => setAgreed(v => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{checked: agreed}}>
        <View style={[styles.box, agreed && styles.boxOn]}>{agreed && <Icon name="check" size={16} color={colors.onSky} />}</View>
        <Text style={[font, styles.checkText]}>I agree to the Terms and Privacy policy</Text>
      </Pressable>
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label="Create account" disabled={!ready} busy={busy} onPress={submit} />

      <Divider label="or sign up with" />
      <View style={styles.social}>
        <SocialButton label="Google" logo={<GoogleLogo />} onPress={() => notConnected('Google')} />
        {Platform.OS === 'ios' && <SocialButton label="Apple" logo={<AppleLogo color={colors.ink} />} onPress={() => notConnected('Apple')} />}
      </View>

      <Text style={[font, styles.footer]}>Already have an account? <Text onPress={onLogin} style={styles.link}>Log in</Text></Text>
    </ScrollView>
  </View>;
}

/** One code screen for two jobs: confirming a new email (emailed code) and the authenticator code when two-step is on. */
type VerifyProps = {email: string; challengeToken?: string; onBack: () => void; onVerified: (user: User) => void};
export function VerifyCodeScreen({email, challengeToken, onBack, onVerified}: VerifyProps) {
  const twoStep = !!challengeToken;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(twoStep ? 0 : RESEND_SECONDS);

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
      const result = twoStep ? await authApi.mfaVerify(challengeToken!, value) : await authApi.verifyEmail(email, value);
      if (result.status === 'signed-in') onVerified(result.user);
      else setError('Something went wrong. Log in again.');
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
      await authApi.resendCode(email);
      setWait(RESEND_SECONDS);
      setNotice('We sent a new code.');
    } catch (e) {
      setError(describe(e));
    }
  };

  return <View style={styles.screen}>
    <View style={styles.backRow}><RoundButton icon="back" onPress={onBack} label="Back" /></View>
    <View style={styles.codeWrap}>
      <Text style={[font, styles.title]}>{twoStep ? 'Two-step check' : 'Check your email'}</Text>
      <Text style={[font, styles.subtitle]}>{twoStep ? 'Open your authenticator app and\nenter the 6-digit code.' : <>We sent a 6-digit code to{'\n'}<Text style={styles.emailText}>{email}</Text></>}</Text>
      <CodeInput value={code} onChange={setCode} onComplete={verify} />
      {!!notice && !error && <Text style={[font, styles.hint]}>{notice}</Text>}
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label={twoStep ? 'Verify' : 'Confirm email'} disabled={code.length !== 6} busy={busy} onPress={() => verify(code)} />
      {!twoStep && <Pressable onPress={resend} disabled={wait > 0} style={styles.resend} accessibilityRole="button" accessibilityState={{disabled: wait > 0}}>
        <Text style={[font, styles.resendText, wait > 0 && styles.muted]}>{wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}</Text>
      </Pressable>}
    </View>
  </View>;
}

/** Forgot password: ask for a code by email, then choose a new password with it. */
export function ForgotPasswordScreen({onBack, onDone}: {onBack: () => void; onDone: () => void}) {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = EMAIL.test(email.trim());

  const send = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError('');
    try { await authApi.forgotPassword(email.trim()); setStep('reset'); }
    catch (e) { setError(describe(e)); }
    finally { setBusy(false); }
  };
  const reset = async () => {
    if (code.length !== 6 || password.length < 8 || busy) return;
    setBusy(true);
    setError('');
    try {
      await authApi.resetPassword(email.trim(), code, password);
      Alert.alert('Password changed', 'Log in with your new password.');
      onDone();
    } catch (e) { setError(describe(e)); }
    finally { setBusy(false); }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.backRow}><RoundButton icon="back" onPress={step === 'reset' ? () => { setStep('email'); setError(''); } : onBack} label="Back" /></View>
    <BrandLogo />
    {step === 'email' ? <>
      <Text style={[font, styles.title]}>Reset your password</Text>
      <Text style={[font, styles.subtitle]}>Enter your email and we will send you a code.</Text>
      <Field label="Email" value={email} onChangeText={v => { setEmail(v); setError(''); }} onSubmitEditing={send} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label="Send code" disabled={!valid} busy={busy} onPress={send} />
    </> : <>
      <Text style={[font, styles.title]}>Choose a new password</Text>
      <Text style={[font, styles.subtitle]}>If that email has an account, we sent a code to{'\n'}<Text style={styles.emailText}>{email}</Text></Text>
      <CodeInput value={code} onChange={setCode} onComplete={() => {}} />
      <Field label="New password" value={password} onChangeText={v => { setPassword(v); setError(''); }} onSubmitEditing={reset} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" />
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label="Change password" disabled={code.length !== 6 || password.length < 8} busy={busy} onPress={reset} />
    </>}
  </ScrollView>;
}

// Six boxes that fill as you type. One hidden input does the typing, so the keyboard and autofill work as usual.
function CodeInput({value, onChange, onComplete}: {value: string; onChange: (value: string) => void; onComplete: (value: string) => void}) {
  const input = useRef<TextInputInstance>(null);
  return <Pressable onPress={() => input.current?.focus()} style={styles.codeRow} accessibilityLabel="Enter the 6-digit code">
    {Array.from({length: 6}, (_, i) => <View key={i} style={[styles.codeBox, i === value.length && styles.codeBoxActive]}><Text style={[font, styles.codeDigit]}>{value[i] ?? ''}</Text></View>)}
    <TextInput ref={input} value={value} autoFocus maxLength={6} keyboardType="number-pad" autoComplete="sms-otp" textContentType="oneTimeCode"
      onChangeText={text => { const digits = text.replace(/\D/g, '').slice(0, 6); onChange(digits); if (digits.length === 6) onComplete(digits); }}
      style={styles.hiddenInput} />
  </Pressable>;
}

type FieldProps = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'textContentType' | 'onBlur' | 'onSubmitEditing' | 'secureTextEntry'> & {label: string};
function Field({label, error, ...input}: FieldProps & {error?: string}) {
  return <View style={styles.field}>
    <Text style={[font, styles.label]}>{label}</Text>
    <View>
      <TextInput {...input} placeholderTextColor={colors.muted} style={[font, styles.input, !!error && styles.inputError]} accessibilityHint={error} />
      {!!error && <View style={styles.inputIcon} pointerEvents="none"><Icon name="alert" size={18} color={colors.danger} /></View>}
    </View>
    {!!error && <Text style={[font, styles.fieldError]}>{error}</Text>}
  </View>;
}

function Primary({label, onPress, disabled, busy}: {label: string; onPress: () => void; disabled?: boolean; busy?: boolean}) {
  return <Pressable onPress={onPress} disabled={disabled || busy} accessibilityRole="button" accessibilityState={{disabled: disabled || busy, busy}}
    style={({pressed}) => [styles.primary, (disabled && !busy) && styles.dim, pressed && styles.pressed]}>
    {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={[font, styles.primaryText]}>{label}</Text>}
  </Pressable>;
}

function SocialButton({label, logo, onPress}: {label: string; logo: React.ReactNode; onPress: () => void}) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Continue with ${label}`} style={({pressed}) => [styles.socialButton, pressed && styles.pressed]}>
    {logo}
    <Text style={[font, styles.socialText]}>{label}</Text>
  </Pressable>;
}

function BrandLogo() {
  return <BrandMark style={styles.logoImage} />;
}

function Divider({label}: {label: string}) {
  return <View style={styles.divider}><View style={styles.rule} /><Text style={[font, styles.dividerText]}>{label}</Text><View style={styles.rule} /></View>;
}

type SsoProps = {onBack: () => void; onEmailLogin: () => void};
type SsoStep = 'email' | 'confirm' | 'signing';
const SIGNING_STEPS = ['Opening your organisation’s sign-in', 'Checking your account', 'Setting up yizelearn'];

/** School or work SSO: find the organisation from the email, confirm it, then sign in through its identity provider. */
export function SsoScreen({onBack, onEmailLogin}: SsoProps) {
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
      const found = await authApi.ssoDiscover(email.trim());
      if (!found.available) { setError('We found no single sign-on for that email. Log in with your email and password instead.'); return; }
      const domain = email.split('@')[1]?.toLowerCase() ?? '';
      setOrg({id: found.connectionId ?? domain, name: found.name ?? domain, domain, kind: /\.(edu|ac|sch)(\.|$)/.test(domain) ? 'school' : 'work', provider: found.protocol ?? 'your organisation'});
      setStep('confirm');
    } catch (e) {
      setError(describe(e));
    } finally {
      setBusy(false);
    }
  };

  // Signing in through the organisation's page needs an in-app browser and its redirect set up first.
  const signIn = () => {
    notConnected(org?.name ?? 'School or work');
  };

  const back = step === 'confirm' ? () => { setStep('email'); setError(''); } : onBack;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {step !== 'signing' && <View style={styles.backRow}><RoundButton icon="back" onPress={back} label="Back" /></View>}
    {step === 'email' && <FadeIn key="email">
      <SsoArt icon="shield" />
      <Text style={[font, styles.title]}>Log in with SSO</Text>
      <Text style={[font, styles.subtitle]}>Use the email your school or employer gave you.{'\n'}We’ll find your organisation.</Text>
      <Field label="School or work email" value={email} onChangeText={t => { setEmail(t); setError(''); }} placeholder="you@school.edu.ng" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label="Find my organisation" disabled={!valid} busy={busy} onPress={find} />
      <Text style={[font, styles.footer]}>No SSO? <Text onPress={onEmailLogin} style={styles.link}>Log in with email and password</Text></Text>
    </FadeIn>}
    {step === 'confirm' && org && <FadeIn key="confirm">
      <SsoArt icon={org.kind === 'school' ? 'school' : 'building'} />
      <Text style={[font, styles.title]}>We found it</Text>
      <Text style={[font, styles.subtitle]}>You’ll sign in on {org.name}’s page,{'\n'}then come straight back here.</Text>
      <View style={styles.orgCard}>
        <View style={styles.orgBadge}><Text style={[font, styles.orgInitials]}>{initials(org.name)}</Text></View>
        <View style={styles.orgCopy}>
          <Text style={[font, styles.orgName]} numberOfLines={1}>{org.name}</Text>
          <Text style={[font, styles.orgMeta]} numberOfLines={1}>{org.domain} · {org.kind === 'school' ? 'School' : 'Work'}</Text>
        </View>
        <Icon name="check" size={22} color={colors.blue700} />
      </View>
      <View style={styles.orgNote}>
        <Icon name="lock" size={18} color={colors.muted} />
        <Text style={[font, styles.orgNoteText]}>{org.provider === 'your organisation' ? 'Your organisation handles sign-in' : `Signs in with ${org.provider}`}. yizelearn never sees your password.</Text>
      </View>
      {!!error && <Text style={[font, styles.error]}>{error}</Text>}
      <Primary label={`Continue to ${org.name}`} onPress={signIn} />
      <Pressable onPress={back} style={styles.resend} accessibilityRole="button"><Text style={[font, styles.resendText]}>Not your organisation? Use another email</Text></Pressable>
    </FadeIn>}
    {step === 'signing' && org && <FadeIn key="signing" style={styles.signing}>
      <SsoArt icon="shield" pulse />
      <Text style={[font, styles.title]}>Signing you in</Text>
      <Text style={[font, styles.subtitle]}>Connecting to {org.name}</Text>
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
      {i < done ? <Icon name="check" size={14} color={colors.onAccent} /> : i === done ? <ActivityIndicator size="small" color={colors.blue700} /> : null}
    </View>
    <Text style={[font, styles.stepText, i > done && styles.muted]}>{label}</Text>
  </View>)}</View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 32},
  backRow: {alignItems: 'flex-start', marginBottom: 4},
  logoImage: {width: 154, height: 48, alignSelf: 'center', marginTop: 12, marginBottom: 24},
  title: {fontSize: type.display - 2, color: colors.ink, fontFamily: fonts.display, textAlign: 'center'},
  subtitle: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 22},
  field: {marginBottom: 18},
  label: {fontSize: type.small, color: colors.ink, fontFamily: fonts.bold, marginBottom: 8},
  inputError: {borderColor: colors.danger, borderWidth: 1.5, backgroundColor: colors.dangerSoft, paddingRight: 46},
  inputIcon: {position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center'},
  fieldError: {fontSize: type.caption, color: colors.danger, marginTop: 6},
  notice: {marginBottom: 16},
  input: {height: 58, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18, fontSize: type.body, color: colors.ink},
  error: {fontSize: type.caption, color: colors.danger, marginBottom: 10, textAlign: 'center'},
  primary: {height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center', marginTop: 4},
  primaryText: {fontSize: type.subheading, color: colors.onSky, fontFamily: fonts.bold},
  dim: {opacity: 0.5},
  pressed: {opacity: 0.8},
  divider: {flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 26},
  rule: {flex: 1, height: 1, backgroundColor: colors.sandLine},
  dividerText: {fontSize: type.caption, color: colors.muted},
  social: {flexDirection: 'row', gap: 12},
  socialButton: {flex: 1, height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  socialText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  sso: {height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 12},
  ssoText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  footer: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 26},
  link: {color: colors.blue700, fontFamily: fonts.bold},
  check: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, marginBottom: 8},
  box: {width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {flex: 1, fontSize: type.label, color: colors.ink},
  forgot: {alignSelf: 'flex-end', marginTop: -6, marginBottom: 14, padding: 4},
  hint: {fontSize: type.caption, color: colors.muted, marginBottom: 10, textAlign: 'center'},
  codeWrap: {flex: 1, paddingHorizontal: spacing.screen, paddingTop: 24},
  emailText: {color: colors.ink, fontFamily: fonts.bold},
  codeRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 24},
  codeBox: {width: 46, height: 58, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  codeBoxActive: {borderColor: colors.sky, borderWidth: 2},
  codeDigit: {fontSize: type.heading, color: colors.ink, fontFamily: fonts.bold},
  hiddenInput: {position: 'absolute', width: 1, height: 1, opacity: 0},
  resend: {alignSelf: 'center', marginTop: 22, padding: 8},
  resendText: {fontSize: type.label, color: colors.blue700, fontFamily: fonts.bold},
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
  orgInitials: {fontSize: type.label, color: colors.onAccent, fontFamily: fonts.bold},
  orgCopy: {flex: 1},
  orgName: {fontSize: type.body, color: colors.ink, fontFamily: fonts.bold},
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
