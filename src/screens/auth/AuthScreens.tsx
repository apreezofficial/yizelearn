import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputInstance, type TextInputProps, View} from 'react-native';
import {ApiError, auth} from '../../api/client';
import {authApi} from '../../api/endpoints';
import type {User} from '../../api/types';
import {RoundButton} from '../../components/Catalog';
import {Icon, type IconName} from '../../components/Icon';
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
    <View style={styles.logo}><Text style={styles.logoText}>y</Text></View>
    <Text style={[styles.title, font]}>Welcome back</Text>
    <Text style={[styles.subtitle, font]}>Log in to keep learning</Text>

    <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
    {!!error && <Text style={[styles.error, font]}>{error}</Text>}
    <Primary label="Log in" disabled={!valid} busy={busy} onPress={submit} />

    <Divider label="or continue with" />
    <View style={styles.social}>
      <SocialButton label="Google" icon="google" onPress={() => notConnected('Google')} />
      {Platform.OS === 'ios' && <SocialButton label="Apple" icon="apple" onPress={() => notConnected('Apple')} />}
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
      <Field label="Full name" value={name} onChangeText={setName} placeholder="Your full name" autoCapitalize="words" autoComplete="name" textContentType="name" />
      <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <Pressable onPress={() => setAgreed(v => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{checked: agreed}}>
        <View style={[styles.box, agreed && styles.boxOn]}>{agreed && <Icon name="check" size={16} color={colors.white} />}</View>
        <Text style={[styles.checkText, font]}>I agree to the Terms and Privacy policy</Text>
      </Pressable>
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Primary label="Create account" disabled={!ready} busy={busy} onPress={submit} />

      <Divider label="or sign up with" />
      <View style={styles.social}>
        <SocialButton label="Google" icon="google" onPress={() => notConnected('Google')} />
        {Platform.OS === 'ios' && <SocialButton label="Apple" icon="apple" onPress={() => notConnected('Apple')} />}
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

function SocialButton({label, icon, onPress}: {label: string; icon: IconName; onPress: () => void}) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Continue with ${label}`} style={({pressed}) => [styles.socialButton, pressed && styles.pressed]}>
    <Icon name={icon} size={22} color={colors.ink} />
    <Text style={[styles.socialText, font]}>{label}</Text>
  </Pressable>;
}

function Divider({label}: {label: string}) {
  return <View style={styles.divider}><View style={styles.rule} /><Text style={[styles.dividerText, font]}>{label}</Text><View style={styles.rule} /></View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 32},
  backRow: {alignItems: 'flex-start', marginBottom: 4},
  logo: {alignSelf: 'center', width: 88, height: 88, borderRadius: 22, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 24},
  logoText: {fontFamily: 'Charmonman-Regular', fontSize: 52, lineHeight: 70, color: colors.white, includeFontPadding: false},
  title: {fontSize: type.display - 2, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  subtitle: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 22},
  field: {marginBottom: 18},
  label: {fontSize: type.small, color: colors.ink, fontWeight: '700', marginBottom: 8},
  input: {height: 58, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18, fontSize: type.body, color: colors.ink},
  error: {fontSize: type.caption, color: colors.danger, marginBottom: 10, textAlign: 'center'},
  primary: {height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center', marginTop: 4},
  primaryText: {fontSize: type.subheading, color: colors.white, fontWeight: '700'},
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
});
