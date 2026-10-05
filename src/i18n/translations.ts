export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    browseFood: string;
    howItWorks: string;
    impact: string;
    leaderboard: string;
    donateFood: string;
    dashboard: string;
    login: string;
    logout: string;
    admin: string;
    emergencyRescue: string;
  };
  roles: {
    donor: string;
    ngo: string;
    volunteer: string;
    beneficiary: string;
    admin: string;
  };
  hero: {
    title: string;
    subtitle: string;
    donateButton: string;
    findFoodButton: string;
    volunteerButton: string;
    liveStats: string;
  };
  stats: {
    foodRescued: string;
    wastePrevented: string;
    beneficiariesServed: string;
    activeVolunteers: string;
    verifiedNgos: string;
  };
  workflow: {
    title: string;
    subtitle: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
    step4: string;
    step4Desc: string;
    step5: string;
    step5Desc: string;
    step6: string;
    step6Desc: string;
  };
  expiry: {
    fresh: string;
    available: string;
    expiringSoon: string;
    urgent: string;
    expired: string;
  };
  priority: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  common: {
    viewDetails: string;
    acceptDonation: string;
    requestPickup: string;
    verifyFood: string;
    redistribute: string;
    cancel: string;
    submit: string;
    save: string;
    filter: string;
    search: string;
    allCategories: string;
    verifiedBadge: string;
    matchScore: string;
    emergencyBanner: string;
    qrScan: string;
    certificate: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'EtenDelen',
    tagline: 'Share Surplus. Reduce Waste. Feed Communities.',
    nav: {
      home: 'Home',
      browseFood: 'Available Surplus',
      howItWorks: 'How It Works',
      impact: 'Impact & Sustainability',
      leaderboard: 'Leaderboard',
      donateFood: '+ Donate Food',
      dashboard: 'Dashboard',
      login: 'Sign In',
      logout: 'Sign Out',
      admin: 'Admin Portal',
      emergencyRescue: 'Emergency Rescue',
    },
    roles: {
      donor: 'Donor',
      ngo: 'NGO / Food Bank',
      volunteer: 'Volunteer',
      beneficiary: 'Beneficiary',
      admin: 'Administrator',
    },
    hero: {
      title: 'Stop Food Waste. Nourish Those in Need.',
      subtitle: 'EtenDelen instantly bridges restaurants, supermarkets, caterers & hotels with verified NGOs and fast logistics to rescue edible surplus food safely.',
      donateButton: 'Donate Surplus Food',
      findFoodButton: 'Browse Surplus Food',
      volunteerButton: 'Join as Volunteer',
      liveStats: 'Real-time Surplus Food Rescue Network',
    },
    stats: {
      foodRescued: 'Total Food Rescued',
      wastePrevented: 'CO₂ Emissions Prevented',
      beneficiariesServed: 'Meals Provided to Beneficiaries',
      activeVolunteers: 'Active Community Volunteers',
      verifiedNgos: 'Verified Food Banks & NGOs',
    },
    workflow: {
      title: 'End-to-End Redistribution Architecture',
      subtitle: 'From surplus food listing to table redistribution with zero food safety compromise.',
      step1: '1. Food Registration',
      step1Desc: 'Donors list surplus with AI image classification, shelf-life and allergen specs.',
      step2: '2. Smart AI Matching',
      step2Desc: 'Match scores compute optimal nearby verified NGOs based on capacity & storage.',
      step3: '3. Fast Acceptance',
      step3Desc: 'NGO reserves food and schedules instant or time-slotted pickup.',
      step4: '4. Volunteer Logistics',
      step4Desc: 'Nearby volunteers receive dispatch, route guidance & QR collection checks.',
      step5: '5. Safety Verification',
      step5Desc: 'Quality, temp, packaging and weight verified on delivery to NGO.',
      step6: '6. Redistribution & Certificate',
      step6Desc: 'Direct meal distribution to communities with tamper-proof certificates & impact metrics.',
    },
    expiry: {
      fresh: 'Freshly Prepared',
      available: 'Available',
      expiringSoon: 'Expiring Soon',
      urgent: 'Urgent Rescue Needed',
      expired: 'Expired (Safety Locked)',
    },
    priority: {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority',
      critical: 'Critical Emergency',
    },
    common: {
      viewDetails: 'View Details',
      acceptDonation: 'Accept Donation',
      requestPickup: 'Request Pickup',
      verifyFood: 'Verify Food Safety',
      redistribute: 'Record Redistribution',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save Changes',
      filter: 'Filter Listings',
      search: 'Search food name, donor, city or ID...',
      allCategories: 'All Categories',
      verifiedBadge: 'Verified NGO',
      matchScore: 'Match Score',
      emergencyBanner: 'Emergency Food Rescue Active',
      qrScan: 'Scan QR Verification',
      certificate: 'View Rescue Certificate',
    },
  },
  ta: {
    appName: 'EtenDelen',
    tagline: 'உணவு உபரியைப் பகிருங்கள். விரயத்தைத் தடுத்து பசியாற்றுங்கள்.',
    nav: {
      home: 'முகப்பு',
      browseFood: 'உபரி உணவுகள்',
      howItWorks: 'எப்படி செயல்படுகிறது',
      impact: 'தாக்கம் & நிலைத்தன்மை',
      leaderboard: 'முன்னிலை பட்டியல்',
      donateFood: '+ உணவு தானம்',
      dashboard: 'டாஷ்போர்டு',
      login: 'உள்நுழைக',
      logout: 'வெளியேறு',
      admin: 'நிர்வாகி தளம்',
      emergencyRescue: 'அவசர உணவு மீட்பு',
    },
    roles: {
      donor: 'உணவு வழங்குநர்',
      ngo: 'தன்னார்வ தொண்டு நிறுவனம்',
      volunteer: 'தன்னார்வலர்',
      beneficiary: 'பயனாளி',
      admin: 'முதன்மை நிர்வாகி',
    },
    hero: {
      title: 'உணவு வீணாவதை நிறுத்துங்கள். தேவையுள்ளவர்களுக்கு வழங்குங்கள்.',
      subtitle: 'உணவகங்கள் மற்றும் வணிகர்களிடமிருந்து உபரி உணவுகளை சரிபார்க்கப்பட்ட தன்னார்வ தொண்டு நிறுவனங்கள் மற்றும் பயனாளிகளுடன் EtenDelen இணைக்கிறது.',
      donateButton: 'உபரி உணவு வழங்குக',
      findFoodButton: 'உணவுகளை பார்வையிடுக',
      volunteerButton: 'தன்னார்வலராக இணையுங்கள்',
      liveStats: 'நேரடி உபரி உணவு மீட்பு நெட்வொர்க்',
    },
    stats: {
      foodRescued: 'மீட்கப்பட்ட மொத்த உணவு',
      wastePrevented: 'தவிர்க்கப்பட்ட கார்பன் உமிழ்வு',
      beneficiariesServed: 'வழங்கப்பட்ட உணவுகள்',
      activeVolunteers: 'செயலில் உள்ள தன்னார்வலர்கள்',
      verifiedNgos: 'சரிபார்க்கப்பட்ட என்.ஜி.ஓக்கள்',
    },
    workflow: {
      title: 'முழுமையான உணவு மறுபகிர்வு செயல்முறை',
      subtitle: 'உணவு வீணாகாமல் மிக விரைவாக தேவையுள்ளோருக்கு பாதுகாப்பாக சென்றடையும் வழிமுறை.',
      step1: '1. உணவு பதிவு',
      step1Desc: 'உணவின் வகை, தரம், காலாவதி நேரம் மற்றும் புகைப்படத்துடன் பதிவு.',
      step2: '2. ஏஐ நுண்ணறிவு பொருத்தம்',
      step2Desc: 'அருகிலுள்ள தகுதியான தொண்டு நிறுவனங்களுக்கு உடனே பரிந்துரை.',
      step3: '3. உடனடி ஏற்பு',
      step3Desc: 'தொண்டு நிறுவனம் உணவை உறுதிசெய்து எடுத்துச்செல்ல கோருகிறது.',
      step4: '4. தன்னார்வலர் பயணம்',
      step4Desc: 'வழிகாட்டுதல் மற்றும் QR சரிபார்ப்புடன் உணவை விரைவாக சேகரிக்கின்றனர்.',
      step5: '5. பாதுகாப்பு சரிபார்ப்பு',
      step5Desc: 'உணவின் தரம், எடை மற்றும் வெப்பநிலையை சரிபார்த்து ஒப்புதல் வழங்கப்படுகிறது.',
      step6: '6. மறுபகிர்வு & சான்றிதழ்',
      step6Desc: 'மக்களுக்கு வழங்கப்பட்டு தானத்திற்கான அதிகாரப்பூர்வ சான்றிதழ் உருவாக்கப்படுகிறது.',
    },
    expiry: {
      fresh: 'புதியதாக தயாரிக்கப்பட்டது',
      available: 'கிடைக்கிறது',
      expiringSoon: 'விரைவில் காலாவதியாகிறது',
      urgent: 'அவசர மீட்பு தேவை',
      expired: 'காலாவதியானது',
    },
    priority: {
      low: 'குறைந்த முன்னுரிமை',
      medium: 'நடுத்தர முன்னுரிமை',
      high: 'அதிக முன்னுரிமை',
      critical: 'மிக அவசரம்',
    },
    common: {
      viewDetails: 'விவரங்களை காண்க',
      acceptDonation: 'தானத்தை ஏற்கவும்',
      requestPickup: 'பிக்கப் கோரவும்',
      verifyFood: 'பாதுகாப்பை சரிபார்க்கவும்',
      redistribute: 'மறுபகிர்வை பதிவு செய்க',
      cancel: 'ரத்து செய்',
      submit: 'சமர்ப்பிக்கவும்',
      save: 'சேமிக்க',
      filter: 'வடிகட்டுக',
      search: 'உணவு பெயர், வழங்குநர், நகரம் தேட...',
      allCategories: 'அனைத்து பிரிவுகள்',
      verifiedBadge: 'சரிபார்க்கப்பட்ட NGO',
      matchScore: 'பொருத்த மதிப்பெண்',
      emergencyBanner: 'அவசர உணவு மீட்பு இயங்குகிறது',
      qrScan: 'QR குறியீட்டை ஸ்கேன் செய்க',
      certificate: 'மீட்பு சான்றிதழ் காண்க',
    },
  },
  hi: {
    appName: 'EtenDelen',
    tagline: 'अधिशेष भोजन साझा करें। अपव्यय घटाएं। समुदाय को भोजन कराएं।',
    nav: {
      home: 'होम',
      browseFood: 'उपलब्ध भोजन',
      howItWorks: 'यह कैसे काम करता है',
      impact: 'प्रभाव और स्थिरता',
      leaderboard: 'लीडरबोर्ड',
      donateFood: '+ भोजन दान करें',
      dashboard: 'डैशबोर्ड',
      login: 'लॉग इन',
      logout: 'लॉग आउट',
      admin: 'एडमिन पोर्टल',
      emergencyRescue: 'आपातकालीन बचाव',
    },
    roles: {
      donor: 'दाता (Donor)',
      ngo: 'एनजीओ / फ़ूड बैंक',
      volunteer: 'स्वयंसेवक (Volunteer)',
      beneficiary: 'लाभार्थी (Beneficiary)',
      admin: 'व्यवस्थापक (Admin)',
    },
    hero: {
      title: 'भोजन की बर्बादी रोकें। जरूरतमंदों को सशक्त बनाएं।',
      subtitle: 'EtenDelen रेस्तरां, सुपरमार्केट, कैटरर्स और होटलों के अतिरिक्त खाद्य को सत्यापित एनजीओ और स्वयंसेवकों से सुरक्षित रूप से जोड़ता है।',
      donateButton: 'अतिरिक्त भोजन दान करें',
      findFoodButton: 'उपलब्ध भोजन खोजें',
      volunteerButton: 'स्वयंसेवक बनें',
      liveStats: 'लाइव अधिशेष भोजन बचाव नेटवर्क',
    },
    stats: {
      foodRescued: 'कुल बचाया गया भोजन',
      wastePrevented: 'रोका गया कार्बन उत्सर्जन',
      beneficiariesServed: 'लाभार्थियों को दिए गए भोजन',
      activeVolunteers: 'सक्रिय स्वयंसेवक',
      verifiedNgos: 'सत्यापित एनजीओ व फ़ूड बैंक',
    },
    workflow: {
      title: 'संपूर्ण पुनर्वितरण प्रणाली',
      subtitle: 'सुरक्षित खाद्य लिस्टिंग से लेकर जरूरतमंदों की थाली तक शून्य अपव्यय प्रक्रिया।',
      step1: '1. भोजन पंजीकरण',
      step1Desc: 'एआई सहायता से भोजन का प्रकार, शेल्फ-लाइफ और एलर्जी विवरण जोड़ें।',
      step2: '2. स्मार्ट एआई मैचिंग',
      step2Desc: 'क्षमता और निकटता के आधार पर सबसे उपयुक्त एनजीओ का सुझाव।',
      step3: '3. त्वरित स्वीकृति',
      step3Desc: 'एनजीओ द्वारा भोजन आरक्षित कर समय सारिणी तय करना।',
      step4: '4. स्वयंसेवक पिकअप',
      step4Desc: 'नेविगेशन और क्यूआर सत्यापन के साथ स्वयंसेवक द्वारा संग्रहण।',
      step5: '5. खाद्य सुरक्षा सत्यापन',
      step5Desc: 'तापमान, पैकेजिंग और गुणवत्ता की पूर्ण जांच और स्वीकृति।',
      step6: '6. वितरण और प्रमाण पत्र',
      step6Desc: 'समुदाय में वितरण और आधिकारिक ईटनडेलन बचाव प्रमाण पत्र निर्माण।',
    },
    expiry: {
      fresh: 'ताज़ा तैयार',
      available: 'उपलब्ध',
      expiringSoon: 'शीघ्र समाप्त होने वाला',
      urgent: 'तत्काल बचाव आवश्यक',
      expired: 'समाप्त (असुरक्षित)',
    },
    priority: {
      low: 'कम प्राथमिकता',
      medium: 'मध्यम प्राथमिकता',
      high: 'उच्च प्राथमिकता',
      critical: 'अत्यंत गंभीर आपातकाल',
    },
    common: {
      viewDetails: 'विवरण देखें',
      acceptDonation: 'दान स्वीकार करें',
      requestPickup: 'पिकअप का अनुरोध करें',
      verifyFood: 'खाद्य सुरक्षा जांचें',
      redistribute: 'वितरण दर्ज करें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      save: 'सुरक्षित करें',
      filter: 'फ़िल्टर करें',
      search: 'भोजन, दाता या स्थान खोजें...',
      allCategories: 'सभी श्रेणियां',
      verifiedBadge: 'सत्यापित एनजीओ',
      matchScore: 'मैच स्कोर',
      emergencyBanner: 'आपातकालीन खाद्य बचाव सक्रिय',
      qrScan: 'QR स्कैन करें',
      certificate: 'बचाव प्रमाण पत्र देखें',
    },
  },
};
