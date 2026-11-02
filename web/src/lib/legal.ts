import {SUPPORT_EMAIL} from './faq';

export type LegalSection = {id: string; title: string; body: (string | string[])[]};
export type LegalDoc = {kicker: string; title: string; version: string; updated: string; effective: string; sections: LegalSection[]};

// DRAFTS. These describe how yizelearn works today, but they are not legal advice. Have a lawyer review them
// (entity name, governing law, refund window, retention periods) before launch.

export const terms: LegalDoc = {
  kicker: 'Terms', title: 'Terms of Service', version: '2026.11', updated: 'November 2, 2026', effective: 'November 2, 2026',
  sections: [
    {id: 'acceptance', title: 'Acceptance of Terms', body: [
      'Welcome to yizelearn. By creating an account or using our website, mobile apps, courses, live classes or any related service (together, the "Service"), you agree to these Terms of Service ("Terms"). If you do not agree, please do not use the Service.',
      'If you use the Service for a school, employer or other organisation, you confirm that you have the authority to accept these Terms on its behalf.',
      'Our Privacy Policy explains how we handle your personal information and forms part of these Terms.',
    ]},
    {id: 'accounts', title: 'Eligibility & Accounts', body: [
      'You must be at least 13 years old to use yizelearn. If you are under 18, you may only use the Service with the permission of a parent or guardian.',
      'You sign in with your email address and a one-time code. You are responsible for everything that happens under your account, so keep your email secure and tell us straight away if you think someone else has used it.',
      'Give us accurate information when you sign up and keep it up to date.',
    ]},
    {id: 'courses', title: 'Courses, Access & Certificates', body: [
      'When you buy a course you get a personal licence to watch and use it for your own learning, for as long as the course is available on yizelearn. You keep access after you finish it, including updates the instructor adds.',
      'Courses may be updated, reorganised or removed by their instructors or by us. If we unpublish a course you have bought, we will keep your progress and certificate.',
      'A certificate is issued when you complete every lesson and pass the required quizzes. It shows that you completed a yizelearn course. It is not a degree or an official qualification, and you must not edit or misrepresent it.',
    ]},
    {id: 'payments', title: 'Payments & Refunds', body: [
      'Prices are shown in naira (₦) and include any taxes we are required to collect. You can pay by card or bank transfer. Payments are handled by our payment partners, and we do not store your full card number.',
      'A bank transfer course unlocks once we have confirmed the payment.',
      'If a course is not right for you, you can ask for a refund within 14 days of buying it, as long as you have completed no more than a quarter of it. To ask, contact us at the address in the Contact section below. Refunds go back to the original payment method where possible.',
      'Promo codes are single-purpose, may expire, and cannot be exchanged for cash.',
    ]},
    {id: 'live-classes', title: 'Live Classes & Community', body: [
      'Live classes and discussions are for learning. Be respectful, stay on topic and do not harass other learners or instructors.',
      'Live classes may be recorded and added to the course. If you speak or write in a recorded class, your contribution may appear in the recording.',
      'We may remove messages, mute people or remove access to protect the community.',
    ]},
    {id: 'your-content', title: 'Your Content', body: [
      'You keep ownership of what you submit, such as assignments, messages, reviews and problem reports. You give us a non-exclusive, worldwide licence to store, display and process it as needed to run and improve the Service.',
      'Only submit things you have the right to share. Do not submit anything unlawful, hateful, misleading, or that infringes someone else\'s rights.',
    ]},
    {id: 'instructors', title: 'Instructors', body: [
      'If you teach on yizelearn, you confirm that you own or have permission to use everything in your course, and that your course is accurate and honest about what it teaches.',
      'You keep ownership of your course. You give us the right to host, show, promote and sell it on the Service. How and when instructors are paid is set out in the instructor agreement you accept when you start teaching.',
    ]},
    {id: 'acceptable-use', title: 'Acceptable Use', body: [
      'You agree not to:',
      ['Share your account, or resell, copy or redistribute course content.', 'Record, scrape or download videos except where the Service allows it.', 'Interfere with the Service, probe it for weaknesses or bypass its protections.', 'Use the Service for anything illegal, or to send spam or malware.', 'Pretend to be someone else, or misuse a certificate.'],
    ]},
    {id: 'intellectual-property', title: 'Intellectual Property', body: [
      'yizelearn, our logo, apps and website design belong to us or our licensors. Course content belongs to its instructors. These Terms do not give you any right to use our brand beyond what our brand guidelines allow.',
      'If you believe something on the Service infringes your copyright, email us with the details and we will look into it promptly.',
    ]},
    {id: 'disclaimers', title: 'Disclaimers & Limits of Liability', body: [
      'We work hard to keep the Service running and accurate, but it is provided "as is". We do not promise it will be uninterrupted or error-free, or that a course will lead to a particular job, income or result.',
      'To the extent the law allows, yizelearn is not liable for indirect or consequential losses, or for any loss above the amount you paid us in the 12 months before the claim. Nothing in these Terms limits liability that cannot be limited by law.',
    ]},
    {id: 'termination', title: 'Suspension & Termination', body: [
      'You can stop using yizelearn and close your account at any time by contacting us.',
      'We may suspend or close an account that breaks these Terms, is used for fraud or abuse, or puts others at risk. Where we can, we will tell you why first.',
      'Sections that by their nature should continue (such as ownership, disclaimers and liability) survive after your account ends.',
    ]},
    {id: 'changes', title: 'Changes to These Terms', body: [
      'We may update these Terms from time to time. When we make an important change we will tell you in the app or by email before it takes effect. If you keep using the Service after that, you accept the updated Terms.',
    ]},
    {id: 'law-contact', title: 'Governing Law & Contact', body: [
      'These Terms are governed by the laws of the Federal Republic of Nigeria, and the courts there will have jurisdiction, without taking away any consumer rights you have where you live.',
      `Questions about these Terms? Email us at ${SUPPORT_EMAIL}.`,
    ]},
  ],
};

export const privacy: LegalDoc = {
  kicker: 'Privacy', title: 'Privacy Policy', version: '2026.11', updated: 'November 2, 2026', effective: 'November 2, 2026',
  sections: [
    {id: 'introduction', title: 'Introduction', body: [
      'This Privacy Policy explains how yizelearn ("we", "us" or "our") collects, uses and protects your personal information when you use our website, mobile apps and courses (the "Service").',
      'By creating an account or using the Service you accept this policy. Where the law asks for your consent, for example to send optional marketing messages, we will ask for it separately.',
      'We handle personal information in line with applicable data protection law, including the Nigeria Data Protection Act 2023 where it applies.',
    ]},
    {id: 'who-we-are', title: 'Who We Are', body: [
      `yizelearn runs short, practical online courses with live classes and certificates. We decide how and why your personal information is used, which makes us the "controller" of it. You can reach us at ${SUPPORT_EMAIL}.`,
    ]},
    {id: 'data-we-collect', title: 'Data We Collect', body: [
      'Information you give us:',
      ['Account details: your name and email address.', 'Learning activity: courses you take, lesson progress, quiz answers and scores, and certificates earned.', 'Messages and posts you send to instructors, in discussions and in live classes.', 'Payments: what you bought, the amount, the method and a payment reference. Card details go to our payment partners and are not stored by us.', 'Problem reports, including the text and any screenshot you choose to send.'],
      'Information we collect automatically:',
      ['Device and app information, such as device type, operating system and app version.', 'Basic usage and error information, so we can keep the Service working.'],
    ]},
    {id: 'how-we-use-data', title: 'How We Use Data', body: [
      'We use your information to:',
      ['Create your account and sign you in with one-time codes.', 'Provide courses, track your progress and issue certificates.', 'Take payments, confirm purchases and handle refunds.', 'Run live classes and let you talk to instructors.', 'Answer your questions and fix problems you report.', 'Keep the Service safe, and prevent fraud and misuse.', 'Improve our courses and apps.', 'Send you service messages, such as sign-in codes and receipts, and, only if you agree, news and offers.'],
      'We do not sell your personal information.',
    ]},
    {id: 'legal-basis', title: 'Legal Basis for Processing', body: [
      'We process your information because it is needed to provide the Service you asked for (our contract with you), because we have a legitimate interest in running and securing it, because the law requires it (for example, keeping payment records), or because you have given your consent. You can withdraw consent at any time.',
    ]},
    {id: 'security', title: 'Security Measures', body: [
      'We protect personal information with measures such as encrypted connections, sign-in by one-time code instead of passwords, and limiting who on our team can see it. No system is perfectly secure, so we also encourage you to keep your email account safe.',
    ]},
    {id: 'sharing', title: 'Information Sharing', body: [
      'We share personal information only when we need to:',
      ['With service providers who help us run yizelearn, such as payment processors, email delivery and hosting. They may only use it to do that work for us.', 'With instructors, which means the details they need to teach you, like your name and your questions and assignments in their course.', 'When the law or a valid legal request requires it, or to protect people from harm or fraud.', 'In a merger, sale or reorganisation, where we will make sure your information stays protected.'],
    ]},
    {id: 'your-rights', title: 'Your Privacy Rights', body: [
      'You can ask us to:',
      ['Tell you what information we hold about you and give you a copy.', 'Correct information that is wrong.', 'Delete your information or your account.', 'Limit or object to certain uses, including marketing.', 'Move your information to another service where that is possible.'],
      `To use any of these rights, email ${SUPPORT_EMAIL}. We may need to confirm it is really you first, and we will reply within a reasonable time. If you are unhappy with our answer, you can complain to your data protection authority.`,
    ]},
    {id: 'retention', title: 'Data Retention', body: [
      'We keep your information while your account is open and for as long as we need it to provide the Service. After you close your account we delete or anonymise your information, except what we must keep for legal, tax or fraud-prevention reasons, such as payment records. Certificates you have earned can be verified for as long as they remain valid.',
    ]},
    {id: 'jurisdiction', title: 'Jurisdiction & Governing Law', body: [
      'This policy is governed by the laws of the Federal Republic of Nigeria. Your information may be processed by providers in other countries. When that happens we take steps to make sure it stays protected in line with the law.',
    ]},
    {id: 'breach', title: 'Data Breach Procedures', body: [
      'If a breach of personal information is likely to put you at risk, we will investigate and contain it quickly, tell the relevant authority within the time the law requires, and let you know what happened and what you can do to protect yourself.',
    ]},
    {id: 'cookies', title: 'Cookies & Tracking', body: [
      'Our website uses only the small pieces of storage it needs to work, for example to remember that you closed the offer banner. We do not use advertising or cross-site tracking cookies. If that changes, we will update this policy and ask for your consent where the law requires.',
    ]},
    {id: 'updates', title: 'Policy Updates', body: [
      'We may update this policy as the Service changes. When we make an important change we will tell you in the app or by email. The date at the top of this page shows when it was last updated.',
    ]},
  ],
};
