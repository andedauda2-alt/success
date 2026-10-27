import { DocumentAnalysis, SupportedLanguage } from '../types';

export interface SampleDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  issuer: string;
  date: string;
  mockRawText: string;
  presetAnalysis: Record<SupportedLanguage, DocumentAnalysis>;
}

export const SAMPLE_DOCUMENTS: SampleDefinition[] = [
  {
    id: 'sample_tenancy',
    title: 'Lagos Residential Tenancy Agreement (2-Bedroom Flat, Yaba)',
    category: 'Tenancy & Housing',
    description: 'Landlord agreement with hidden caution fees, 14-day eviction clause, and repair shifting.',
    issuer: 'Barr. K. O. Alabi & Co. (Solicitors for Landlord)',
    date: '14th October 2026',
    mockRawText: `TENANCY AGREEMENT
Between CHIEF B. A. JOHNSON (Landlord) and TENANT (Occupant)
Premises: 4B Montgomery Road, Yaba, Lagos State.
Rent: N2,500,000 per annum payable two (2) years upfront (N5,000,000).
Agency Fee: 10% (N500,000). Legal Agreement Fee: 10% (N500,000).
Caution Deposit: N350,000 (Strictly Non-Refundable at tenancy expiration).
CLAUSE 4: The Landlord reserves the unconditional right to review the rent upwards by up to 40% at the expiration of the first twelve months.
CLAUSE 7: In the event of any payment default exceeding seven (7) days, the Tenant waives all rights under the Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery of possession within fourteen (14) days.
CLAUSE 11: Tenant shall be solely responsible for all external structural repairs, including roof leakage, borehole pump replacement, and transformer levies.`,
    presetAnalysis: {
      pidgin: {
        title: 'Tenancy Agreement (2-Bed Flat, Yaba Lagos)',
        documentType: 'Tenancy Agreement',
        riskLevel: 'CRITICAL',
        riskScore: 88,
        summary: 'Dem wan collect 2 years rent upfront (N5,000,000) plus N1,350,000 extra charges. Worse pass that, clause 4 and clause 7 get heavy wahala: the landlord fit evict you within 14 days and dey ask you make you fix roof with your own money!',
        keyHighlights: [
          'Landlord dey demand 2 years rent upfront against Lagos Tenancy Law',
          'N350,000 caution deposit marked as "strictly non-refundable"',
          '14-day eviction notice instead of legal 6-month notice',
          'You go dey repair landlord roof and borehole pump',
        ],
        wahalaClauses: [
          {
            id: 'wh-1',
            title: '14-Day Rush Eviction Clause (Illegal)',
            quote: 'Tenant waives all rights under Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery within fourteen (14) days.',
            riskLevel: 'CRITICAL',
            explanation: 'Under Lagos State Tenancy Law, yearly tenant get right to full 6-month notice to quit. Dem dey try make you sign away your legal right so dem fit throw your load comot sharp-sharp.',
            betterAlternative: 'Tell dem make dem strike out Clause 7 completely. Insist on standard statutory notice under Lagos Law 2011.',
            legalContext: 'Section 13 of Lagos Tenancy Law 2011 invalidates forceful waiver of notice to quit for yearly tenants.',
          },
          {
            id: 'wh-2',
            title: 'Non-Refundable Caution Deposit (Daylight Robbery)',
            quote: 'Caution Deposit: N350,000 (Strictly Non-Refundable at tenancy expiration)',
            riskLevel: 'CRITICAL',
            explanation: 'Caution deposit na collateral in case something spoil. If you pack out and everywhere clean, dem suppose refund your money. To write "non-refundable" mean say dem don chop your N350k already.',
            betterAlternative: 'Demand: "Caution deposit shall be fully refunded within 14 days of vacancy upon joint property inspection."',
            legalContext: 'Caution deposits are trust funds held in escrow for damages, not landlord revenue.',
          },
          {
            id: 'wh-3',
            title: 'Tenant Paying for Roof & Structural Repairs',
            quote: 'Tenant shall be solely responsible for all external structural repairs, including roof leakage, borehole pump replacement.',
            riskLevel: 'WARNING',
            explanation: 'You be tenant, you no be co-owner. Roof and borehole na structural fixtures wey landlord must maintain.',
            betterAlternative: 'Amend: "Tenant only responsible for minor internal tenant-caused damages. Landlord handles all structural, roof, and plumbing infrastructure."',
            legalContext: 'Habitability and structural upkeep remain the lessor legal obligation.',
          },
        ],
        financialBreakdown: {
          totalDue: 'N6,350,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Rent (2 Years Upfront)', amount: '₦5,000,000', frequency: '2 Years', isHiddenOrShady: true },
            { item: 'Agency Commission (10%)', amount: '₦500,000', frequency: 'One-off', isHiddenOrShady: false },
            { item: 'Legal / Agreement Fee (10%)', amount: '₦500,000', frequency: 'One-off', isHiddenOrShady: false },
            { item: 'Non-refundable Caution Deposit', amount: '₦350,000', frequency: 'Non-refundable', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'DO NOT SIGN yet. Call the lawyer or landlord agent immediately.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Demand that Clause 7 (14 days eviction) and "non-refundable" on caution fee be cancelled and countersigned.', priority: 'important' },
          { stepNumber: 3, text: 'Remind them say Lagos Tenancy Law Section 4 forbids demanding more than 1 year rent upfront for residential sitting tenants.', priority: 'recommended' },
        ],
        voiceNoteScript: 'My brother, hold body first! No sign this tenancy paper at all. Number one wahala: the caution fee of 350,000 naira, dem write say non-refundable! That one na chop. Second wahala, dem write say if you delay 7 days, dem fit evict you in 14 days, which is totally against Lagos State law. Tell the lawyer make dem clean those clauses first!',
        whatsAppShareMessage: '🚨 *WAHALA ALERT: Review on Yaba Tenancy Agreement*\n\nBro/Sis, look this agreement well before you pay or sign:\n• ❌ Caution Deposit of ₦350k marked *Non-refundable*\n• ❌ Illegal 14-day eviction notice (Lagos law gives 6 months!)\n• ❌ Forcing you to fix Landlord roof and borehole\n\n*Advise:* Ask the lawyer to delete Clause 7 and make caution refundable before dropping 1 kobo.',
      },
      yoruba: {
        title: 'Àdéhùn Ilé Gbígbé (Yaba, Ìpínlẹ̀ Èkó)',
        documentType: 'Àdéhùn Ilé (Tenancy Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 88,
        summary: 'Wọ́n fẹ́ gba owó ilé ọdún méjì lẹ́ẹ̀kan ṣoṣo (₦5,000,000) pẹ̀lú àfikún owó ₦1,350,000. Èyí tó burú jù ni pé, wọ́n kọ sínú àdéhùn pé bí o bá pẹ́ fún ọjọ́ méje (7), wọ́n lè lé ọ jáde láàárín ọjọ́ mẹ́rìnlá (14) dípò oṣù mẹ́fà tí òfin Èkó fọwọ́ sí!',
        keyHighlights: [
          'Onílé ń béèrè owó ilé ọdún méjì lẹ́ẹ̀kan ṣoṣo ní lòdì sí Òfin Ilé Èkó',
          'Owó ìdánilójú (₦350,000 caution fee) tí wọn ní kò ṣe é dá padà rárá',
          'Ìkìlọ̀ ìléjáde ọjọ́ mẹ́rìnlá (14 days) dípò oṣù mẹ́fà (6 months)',
          'Wọ́n fẹ́ kí ìwọ ayálégbé máa tún òrùlé ilé àti ẹ̀rọ omi borehole ṣe',
        ],
        wahalaClauses: [
          {
            id: 'wh-yo-1',
            title: 'Ìléjáde Kíákíá Láàárín Ọjọ́ 14 (Lòdì Sí Òfin)',
            quote: 'Tenant waives all rights under Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery within fourteen (14) days.',
            riskLevel: 'CRITICAL',
            explanation: 'Ní abẹ́ Òfin Ilé Gbígbé Ìpínlẹ̀ Èkó, ẹni tí ń san owó ilé lọ́dọọdún ní ẹ̀tọ́ sí ìkìlọ̀ oṣù mẹ́fà gbáko kí onílé tó lè sọ pé kó kó jáde. Wọ́n fẹ́ fi ẹ̀tọ́ rẹ dù ọ́ kí wọ́n baà lè da ẹrù rẹ síta ní kánmó.',
            betterAlternative: 'Sọ fún agbẹjọ́rò náà pé kí wọ́n pa Kókó Keje (Clause 7) rẹ́ pátápátá, kí wọ́n sì tẹ̀lé ìlànà oṣù mẹ́fà gẹ́gẹ́ bí òfin Èkó ṣe là á lálẹ̀.',
            legalContext: 'Abala 13 ninu Òfin Ilé Ìpínlẹ̀ Èkó ọdún 2011 kò gba kí onílé dín ọjọ́ ìkìlọ̀ kù fún ayálégbé.',
          },
          {
            id: 'wh-yo-2',
            title: 'Owó Ìdánilójú (Caution Deposit) tí Kò Ṣe Dá Padà',
            quote: 'Caution Deposit: N350,000 (Strictly Non-Refundable at tenancy expiration)',
            riskLevel: 'CRITICAL',
            explanation: 'Owó ìdánilójú jẹ́ owó ìdúró bí nǹkan bá bàjẹ́ nígbà tí o bá ń gbé ilé náà. Bí o bá kó jáde tí gbogbo ilé sì wà ní mímọ́, wọ́n gbọdọ̀ dá gbogbo owó náà padà fún ọ. Kíkọ pé kò ṣe é dá padà jẹ́ ìwà jẹgúdújẹrá.',
            betterAlternative: 'Béèrè pé kí wọ́n kọ ọ́ pé: "Wọ́n gbọdọ̀ dá gbogbo owó ìdánilójú padà láàárín ọjọ́ mẹ́rìnlá lẹ́yìn àyẹ̀wò ilé."',
            legalContext: 'Owó ìdánilójú kì í ṣe èrè fún onílé, owó amúlùmọ́là ni.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦6,350,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Owó Ilé (Ọdún Méjì Lẹ́ẹ̀kan)', amount: '₦5,000,000', frequency: 'Ọdún 2', isHiddenOrShady: true },
            { item: 'Owó Aṣojú (Agency Fee 10%)', amount: '₦500,000', frequency: 'Ẹ̀ẹ̀kan', isHiddenOrShady: false },
            { item: 'Owó Àdéhùn Agbẹjọ́rò (10%)', amount: '₦500,000', frequency: 'Ẹ̀ẹ̀kan', isHiddenOrShady: false },
            { item: 'Owó Ìdánilójú (Caution Deposit)', amount: '₦350,000', frequency: 'Ti wọn kò fẹ́ dá padà', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Ẹ MÁ ṢE FỌWỌ́ SÍ I RÁRÁ! Pe agbẹjọ́rò tàbí onílé lẹ́sẹ̀kẹsẹ̀.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Béèrè pé kí wọ́n pa ọ̀rọ̀ ìléjáde ọjọ́ 14 rẹ́, kí wọ́n sì sọ owó ìdánilójú di èyí tí a lè dá padà.', priority: 'important' },
          { stepNumber: 3, text: 'Rán wọn létí pé Òfin Èkó kò gba kí onílé béèrè owó ilé tó ju ọdún kan lọ lọ́wọ́ ayálégbé.', priority: 'recommended' },
        ],
        voiceNoteScript: 'Ẹ kiyesi i! Ẹ má tíì fọwọ́ sí àdéhùn ilé yìí rárá. Ọ̀rọ̀ àkọ́kọ́ ni pé owó caution deposit tí ó jẹ́ ẹgbẹ̀rún lọ́nà ọ̀ọ́dúnrún àti àádọ́ta náírà, wọ́n kọ ọ́ pé wọn kò ní dá a padà! Ẹ̀kejì, wọ́n ní àwọn lè lé yín jáde láàárín ọjọ́ mẹ́rìnlá, èyí tó lòdì sí òfin Èkó. Ẹ sọ fún agbẹjọ́rò náà pé kí ó yọ àwọn kókó wọ̀nyí kúrò kọ́kọ́!',
        whatsAppShareMessage: '🚨 *IKILỌ PATAKI: Àdéhùn Ilé Yaba*\n\nẸ kiyesi i kí ẹ tó sanwó tàbí fọwọ́ sí iwe yii:\n• ❌ Caution Deposit ₦350k kò ṣe é dá padà\n• ❌ Ìkìlọ̀ ọjọ́ 14 dípò oṣù 6 tí òfin là kalẹ̀\n• ❌ Wọ́n fẹ́ kí ẹ tún òrùlé ṣe fún onílé\n\n*Ìmọ̀ràn:* Ẹ sọ fún wọn kí wọ́n yọ Clause 7 kúrò kí ẹ tó san owó kankan.',
      },
      hausa: {
        title: 'Yarjejeniyar Hayar Gida (Yaba, Jihar Legas)',
        documentType: 'Yarjejeniyar Haya (Tenancy Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 88,
        summary: 'Suna neman kudin hayar shekaru biyu gaba daya (₦5,000,000) tare da karin kudaden da suka kai ₦1,350,000. Mafi muni shine sun rubuta cewa idan ka jinkirta da kwanaki 7, za su iya korarka a cikin kwanaki 14 kacal maimakon watanni 6 kamar yadda dokar jihar Legas ta tanada!',
        keyHighlights: [
          'Mai gida yana neman kudin hayar shekara biyu gaba daya wanda ya saba doka',
          'Kudin lamuni (₦350,000) an rubuta ba za a mayar ba',
          'Sanarwar kora ta kwanaki 14 maimakon watanni 6 na doka',
          'Sun dora maka gyaran rufin asiri da famfon ruwa na gida',
        ],
        wahalaClauses: [
          {
            id: 'wh-ha-1',
            title: 'Kora Cikin Kwanaki 14 (Ya Saba Dokar Kasa)',
            quote: 'Tenant waives all rights under Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery within fourteen (14) days.',
            riskLevel: 'CRITICAL',
            explanation: 'A karkashin dokar hayar jihar Legas, mai hayar shekara yana da hakkin samun sanarwar watanni 6 kafin a fitar dashi. Suna so su kwace maka hakkin ka ne domin su fitar da kayanka da wuri.',
            betterAlternative: 'Ka nemi su goge wannan sashe na 7 gaba daya, su bi tsarin watanni 6 na doka.',
            legalContext: 'Sashe na 13 na Dokar Haya ta Jihar Legas 2011 ya haramta takaita lokacin sanarwa.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦6,350,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Kudin Haya (Shekaru 2)', amount: '₦5,000,000', frequency: 'Shekaru 2', isHiddenOrShady: true },
            { item: 'Kudin Dillali (10%)', amount: '₦500,000', frequency: 'Sau Daya', isHiddenOrShady: false },
            { item: 'Kudin Lauya (10%)', amount: '₦500,000', frequency: 'Sau Daya', isHiddenOrShady: false },
            { item: 'Kudin Lamuni (Caution Deposit)', amount: '₦350,000', frequency: 'Wanda ba za a mayar ba', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'KADA KA SANYA HANNO TUKUNA! Tuntubi lauyan mai gidan nan take.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Nemi a cire sharadin korar kwanaki 14 kuma a tabbatar ana mayar da kudin lamuni.', priority: 'important' },
          { stepNumber: 3, text: 'Tuna musu cewa dokar Legas ta hana neman kudin haya sama da shekara guda.', priority: 'recommended' },
        ],
        voiceNoteScript: 'Kayi hakuri ka duba wannan takarda da kyau! Kada ka sa hannu tukuna. Akwai matsala babba: kudin caution na dubu dari uku da hamsin, sun rubuta ba za a mayar maka ba. Na biyu, sun ce zasu iya korarka a cikin kwanaki goma sha hudu, wanda ya saba wa dokar jihar Legas. Nemi lauya ya goge wadannan sharuddan kamin ka biya ko sisi!',
        whatsAppShareMessage: '🚨 *GARGADI MAI MAHIMMANCI: Yarjejeniyar Hayar Gida*\n\nKa kula sosai kafin ka biya ko ka sanya hannu:\n• ❌ Kudin Caution ₦350k ba za a mayar ba\n• ❌ Sanarwar korar kwanaki 14 maimakon watanni 6\n• ❌ Dora maka gyaran rufin gida da famfo\n\n*Shawarwari:* Nemi a goge Clause 7 kafin ka biya ko sisi.',
      },
      igbo: {
        title: 'Nkwekọrịta Mgbazinye Ụlọ (Yaba, Lagos)',
        documentType: 'Akwụkwọ Mgbazinye Ụlọ (Tenancy Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 88,
        summary: 'Ha chọrọ ịnakọta ego ụlọ afọ abụọ ozugbo (₦5,000,000) tinyere ụgwọ ndị ọzọ ruru ₦1,350,000. Nke kacha njọ bụ na ha dere na ọ bụrụ na ị kwụghị ụgwọ n’ime ụbọchị asaa (7), ha nwere ike ịchụpụ gị n’ime ụbọchị iri na anọ (14) kama ọnwa isii iwu Lagos kwadoro!',
        keyHighlights: [
          'Onye nwe ụlọ na-achọ ego afọ abụọ n’otu oge nke megidere iwu Lagos',
          'Ego nchebe (₦350,000 caution deposit) agaghị adị nloghachi',
          'Ọkwa nchụpụ ụbọchị 14 kama ọnwa 6 nke iwu kwadoro',
          'Ị ga-akwụ ụgwọ maka nrụzi elu ụlọ na injin mmiri',
        ],
        wahalaClauses: [
          {
            id: 'wh-ig-1',
            title: 'Nchụpụ Ngwa Ngwa N’ime Ụbọchị 14 (Megidere Iwu)',
            quote: 'Tenant waives all rights under Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery within fourteen (14) days.',
            riskLevel: 'CRITICAL',
            explanation: 'N’okpuru iwu ụlọ nke Lagos State, onye bi n’ụlọ na-akwụ ụgwọ afọ nwere ikike inweta ọkwa ọnwa isii tupu achụpụ ya. Ha na-anwa ịpụnara gị ikike gị ka ha nwee ike ịtụfu ngwongwo gị.',
            betterAlternative: 'Gwa ha ka ha hichapụ Nkebi nke 7 kpamkpam ma soro iwu ọnwa 6.',
            legalContext: 'Nkebi nke 13 n’ime Iwu Tenancy Lagos State 2011 akwadoghị ịbelata oge ọkwa.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦6,350,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Ụgwọ Ụlọ (Afọ Abụọ)', amount: '₦5,000,000', frequency: 'Afọ 2', isHiddenOrShady: true },
            { item: 'Ụgwọ Onye Nnọchi (10%)', amount: '₦500,000', frequency: 'Otu ugboro', isHiddenOrShady: false },
            { item: 'Ụgwọ Ndị Ọkaikpe (10%)', amount: '₦500,000', frequency: 'Otu ugboro', isHiddenOrShady: false },
            { item: 'Ego Nchebe (Caution Deposit)', amount: '₦350,000', frequency: 'Agaghị eweghachi', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'ABỤNYE KWALA AKA! Kpọọ ọkaikpe ma ọ bụ onye nwe ụlọ ozugbo.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Kwuo ka ewepụ nkebi ịchụpụ mmadụ n’ime ụbọchị 14 ma mee ka ego nchebe bụrụ ihe a ga-eweghachi.', priority: 'important' },
          { stepNumber: 3, text: 'Cheta ha na iwu Lagos ekweghị ịnara ego gafere otu afọ.', priority: 'recommended' },
        ],
        voiceNoteScript: 'Biko nwanne m, chere obere! E binyela aka n’akwụkwọ a ma ọlị. Nsogbu nke mbụ bụ na ego caution nke puku narị atọ na iri ise agaghị eweghachi gị. Nke abụọ, ha dere na ha nwere ike ịchụpụ gị n’ime ụbọchị iri na anọ kama ọnwa isii. Gwa onye ọkaikpe ka o wepụ ihe ndị a tupu ị kwụọ ego ọ bụla!',
        whatsAppShareMessage: '🚨 *ỌKWA ỊDỌ AKA NA NTỊ: Akwụkwọ Ụlọ Yaba*\n\nKpachara anya tupu ị kwụọ ụgwọ ma ọ bụ bịanye aka:\n• ❌ Ego Caution ₦350k agaghị eweghachi\n• ❌ Ọkwa nchụpụ ụbọchị 14 kama ọnwa 6\n• ❌ Ịrụzi elu ụlọ onye nwe ụlọ\n\n*Ndụmọdụ:* Gwa ha ka ha hichapụ Clause 7 tupu i tinye ego.',
      },
      english: {
        title: 'Residential Tenancy Agreement (Yaba, Lagos)',
        documentType: 'Tenancy Agreement',
        riskLevel: 'CRITICAL',
        riskScore: 88,
        summary: 'The landlord is demanding two years rent upfront (₦5,000,000) plus ₦1,350,000 in additional fees. Most critically, clause 4 and clause 7 attempt to strip your legal protections: allowing eviction in just 14 days and forcing you to pay for roof and structural repairs!',
        keyHighlights: [
          'Demands 2 years rent upfront in violation of Lagos Tenancy Law',
          '₦350,000 caution deposit classified as "strictly non-refundable"',
          '14-day rush eviction notice instead of statutory 6-month notice',
          'Shifts structural roof and borehole repair costs onto the tenant',
        ],
        wahalaClauses: [
          {
            id: 'wh-en-1',
            title: '14-Day Rush Eviction Clause (Unlawful Waiver)',
            quote: 'Tenant waives all rights under Lagos State Tenancy Law 2011 to statutory 6-month notice and consents to summary recovery within fourteen (14) days.',
            riskLevel: 'CRITICAL',
            explanation: 'Under the Lagos State Tenancy Law 2011, yearly tenants are legally entitled to 6 months written notice to quit. This clause seeks to force you to waive your statutory protections.',
            betterAlternative: 'Demand Clause 7 be struck out entirely. Insist on standard statutory notice as required by Lagos State Law.',
            legalContext: 'Section 13 of the Lagos State Tenancy Law 2011.',
          },
          {
            id: 'wh-en-2',
            title: 'Non-Refundable Caution Deposit',
            quote: 'Caution Deposit: N350,000 (Strictly Non-Refundable at tenancy expiration)',
            riskLevel: 'CRITICAL',
            explanation: 'A caution deposit is security collateral held in trust for potential tenant-caused damage. If the property is returned in good condition, it must be refunded in full.',
            betterAlternative: 'Amend to: "Caution deposit shall be refunded in full within 14 days of vacancy subject to joint inspection."',
            legalContext: 'Caution deposits are trust funds, not landlord remuneration.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦6,350,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Rent (2 Years Upfront)', amount: '₦5,000,000', frequency: '2 Years', isHiddenOrShady: true },
            { item: 'Agency Commission (10%)', amount: '₦500,000', frequency: 'One-off', isHiddenOrShady: false },
            { item: 'Legal Agreement Fee (10%)', amount: '₦500,000', frequency: 'One-off', isHiddenOrShady: false },
            { item: 'Non-refundable Caution Deposit', amount: '₦350,000', frequency: 'Non-refundable', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'DO NOT SIGN. Contact the solicitor or landlord immediately.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Demand that Clause 7 (14 days eviction) and "non-refundable" caution be removed.', priority: 'important' },
          { stepNumber: 3, text: 'Cite Section 4 of the Lagos Tenancy Law regarding advance rent limits.', priority: 'recommended' },
        ],
        voiceNoteScript: 'Hold on before you sign this document! There are two major red flags: First, the 350,000 naira caution deposit is marked as non-refundable. Second, they have inserted a clause claiming they can evict you within 14 days, which directly violates Lagos State law. Have the lawyer strike these out before paying.',
        whatsAppShareMessage: '🚨 *RED FLAG ALERT: Lagos Tenancy Agreement Review*\n\nPlease review before signing or paying:\n• ❌ Caution Deposit of ₦350k marked Non-refundable\n• ❌ Illegal 14-day eviction notice (statutory law grants 6 months)\n• ❌ Tenant forced to bear roof and structural repairs\n\n*Action:* Require lawyer to amend Clause 7 and make caution refundable before making payment.',
      },
    },
  },
  {
    id: 'sample_loan',
    title: 'FastCash 9ja Instant Mobile Loan Offer & Terms',
    category: 'Loan & Fintech',
    description: 'Predatory 2% daily interest rate with contact book scraping and public shaming consent.',
    issuer: 'FastCash Digital Micro-Lending Ltd',
    date: '22nd October 2026',
    mockRawText: `LOAN DISBURSEMENT SCHEDULE & USER CONSENT
Principal: N50,000
Disbursed Amount (after 20% processing deduction): N40,000
Repayment Period: 14 Days
Daily Service Interest: 2.0% per day (Compounded weekly)
Repayment Amount at Day 14: N68,400
Default Penalty: N3,000 flat plus 5% daily surcharge.
SECTION 8: The Borrower grants irrevocable authorization to access device contact list, call logs, and SMS messages. In event of default, lender reserves the right to notify emergency contacts, employer, and social references regarding outstanding indebtedness.
SECTION 12: Direct debit mandate via BVN to charge any account linked to the Borrower across all licensed Nigerian deposit money banks without prior notification.`,
    presetAnalysis: {
      pidgin: {
        title: 'FastCash 9ja Loan Terms (N50k Loan)',
        documentType: 'Loan Agreement',
        riskLevel: 'CRITICAL',
        riskScore: 96,
        summary: 'This loan na pure trap! You borrow N50k, dem go give you only N40k, but inside 14 days you must pay back N68,400 (dat na more than 700% interest per year!). Plus dem want permission to message all your WhatsApp contacts and shame you if you miss 1 day!',
        keyHighlights: [
          'Upfront deduction of N10,000 processing fee',
          '2% DAILY interest rate (Compound 730% APR)',
          'Illegal contact-list shaming and harassment clause',
          'Unauthorized BVN direct debit across all personal bank accounts',
        ],
        wahalaClauses: [
          {
            id: 'wh-ln-1',
            title: 'Contact Shaming & Defamation Clause (FCCPC Banned)',
            quote: 'Borrower grants irrevocable authorization to access device contact list... lender reserves right to notify emergency contacts, employer, and social references.',
            riskLevel: 'CRITICAL',
            explanation: 'Dem wan harvest your whole phone contacts so if you delay small, dem go send broadcast message to your boss, pastor, in-laws and friends say you be criminal debtor.',
            betterAlternative: 'Never grant contact permission on loan apps. FCCPC Nigeria has banned contact scraping and shaming.',
            legalContext: 'Federal Competition and Consumer Protection Commission (FCCPC) regulatory framework.',
          },
        ],
        financialBreakdown: {
          totalDue: 'N68,400 (on N40,000 received)',
          currency: 'NGN (₦)',
          items: [
            { item: 'Nominal Loan Amount', amount: '₦50,000', frequency: 'Principal', isHiddenOrShady: false },
            { item: 'Upfront Cut (Hidden Deduction)', amount: '-₦10,000', frequency: 'Fee', isHiddenOrShady: true },
            { item: 'Cash Received in Bank', amount: '₦40,000', frequency: 'Net', isHiddenOrShady: false },
            { item: '14-Day Interest & Surcharge', amount: '₦28,400', frequency: '14 Days (71% effective)', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'DO NOT ACCEPT this loan offer or install APK with contact permissions.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Check the FCCPC whitelist of approved digital lenders before taking any loan.', priority: 'important' },
        ],
        voiceNoteScript: 'Abeg make you RUN from this loan! You wan collect 50,000 naira, dem go cut 10,000 immediately give you 40k. Then in just two weeks, dem go demand 68,400! And dem wan use your contact list shame you for front of your people. Abeg no accept am!',
        whatsAppShareMessage: '⚠️ *SCAM/PREDATORY LOAN ALERT*\n\nPlease don’t accept this FastCash 9ja loan:\n• Received: ₦40,000\n• Paying back in 14 days: ₦68,400\n• Traps phone contacts for defamation\n\nBanned by FCCPC. Please warn friends and family.',
      },
      yoruba: {
        title: 'Àdéhùn Gbèsè FastCash 9ja (₦50,000)',
        documentType: 'Àdéhùn Gbèsè (Loan Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 96,
        summary: 'Gbèsè yìí jẹ́ tẹkùn ńlá! Wọ́n ní wọ́n fẹ́ yá ọ ní ₦50,000, ṣùgbọ́n ₦40,000 péré ni wọ́n máa san sínú àkópọ̀ rẹ, síbẹ̀ ní ọjọ́ mẹ́rìnlá péré o gbọdọ̀ san ₦68,400 padà! Pẹ̀lú èyí, wọ́n fẹ́ gba àyè láti wo gbogbo nọ́mbà orí fóònù rẹ láti tẹ́ ọ lójú.',
        keyHighlights: [
          'Wọ́n kọ́kọ́ yọ ₦10,000 kúrò lójú ẹsẹ̀ bí owó processing',
          'Èrè owó 2% LÓJOOJÚMỌ́ (tó ju 700% lọ lódún)',
          'Àbá láti fi nọ́mbà àwọn mọ̀lẹ́bí àti ọ̀gá rẹ kọ̀wé tẹ́ ọ lójú',
          'Fífi BVN rẹ fa gbogbo owó orí àkópọ̀ rẹ láì sọ fún ọ',
        ],
        wahalaClauses: [
          {
            id: 'wh-ln-yo-1',
            title: 'Àbá Ìtìjú àti Ìtẹ́lójú Lori Fóònù (Èyí tí FCCPC Ti Fòfin Dè)',
            quote: 'Borrower grants irrevocable authorization to access device contact list... lender reserves right to notify emergency contacts, employer, and social references.',
            riskLevel: 'CRITICAL',
            explanation: 'Wọ́n fẹ́ gba gbogbo nọ́mbà àwọn èèyàn rẹ kí wọ́n baà lè fi ọ̀rọ̀ ránṣẹ́ sí ọ̀gá rẹ, pásítọ̀, àti àwọn mọ̀lẹ́bí rẹ pé o jẹ́ onígbèsè olè bí o bá pẹ́ díẹ̀.',
            betterAlternative: 'Má ṣe gba irú gbèsè yìí rárá. Ìjọba FCCPC ti sọ pé ó lòdì sí òfin láti fi orúkọ ẹni ránṣẹ́ sí mọ̀lẹ́bí.',
            legalContext: 'Ìlànà FCCPC lòdì sí lílo nọ́mbà fóònù láti tẹ́ onígbèsè lójú.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦68,400 (Lórí ₦40,000 tí o gbà)',
          currency: 'NGN (₦)',
          items: [
            { item: 'Gbèsè tí o béèrè', amount: '₦50,000', frequency: 'Principal', isHiddenOrShady: false },
            { item: 'Owó tí wọ́n yọ lójú ẹsẹ̀', amount: '-₦10,000', frequency: 'Ìkọ̀kọ̀', isHiddenOrShady: true },
            { item: 'Owó tí o rí gbà gan-an', amount: '₦40,000', frequency: 'Net', isHiddenOrShady: false },
            { item: 'Èrè àti Ìtanràn ọjọ́ 14', amount: '₦28,400', frequency: 'Ọjọ́ 14', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Ẹ MÁ ṢE GBA GBÈSÈ YÌÍ RÁRÁ! Pa app náà rẹ́ lórí fóònù rẹ.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Ṣàyẹ̀wò àwọn ilé-iṣẹ́ gbèsè tí FCCPC àti CBN fọwọ́ sí kí ẹ tó yá owó.', priority: 'important' },
        ],
        voiceNoteScript: 'Ẹ jọ̀wọ́, ẹ sá fún gbèsè yìí! Ẹ fẹ́ yá 50,000 naira, wọ́n yọ ẹgbẹ̀rún mẹ́wàá lójú ẹsẹ̀ fún yín ní 40,000. Láàárín ọ̀sẹ̀ méjì péré wọ́n ní kẹ́ ẹ san 68,400 naira! Pẹ̀lú èyí wọ́n tún fẹ́ lo nọ́mbà àwọn èèyàn yín láti tẹ́ yín lójú. Ẹ má ṣe gbà á o!',
        whatsAppShareMessage: '⚠️ *IKILỌ LÓRÍ GBÈSÈ JẸGÚDÚJẸRÁ*\n\nẸ jọ̀wọ́ ẹ má ṣe gba gbèsè FastCash 9ja yìí:\n• Owó tí a gbà: ₦40,000\n• Owó tí wọ́n fẹ́ gba padà ní ọjọ́ 14: ₦68,400\n• Wọ́n ń jí nọ́mbà fóònù láti fi tẹ́ èèyàn lójú\n\nFCCPC ti fòfin de èyí. Ẹ sọ fún gbogbo èèyàn.',
      },
      hausa: {
        title: 'Sharuddan Bashin FastCash 9ja (₦50,000)',
        documentType: 'Yarjejeniyar Bashi (Loan Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 96,
        summary: 'Wannan bashin tarko ne babba! Ka nemi ₦50,000 amma ₦40,000 kacal za a tura maka, kuma a cikin kwanaki 14 dole ne ka biya ₦68,400! Sannan suna son izinin shiga lambobin wayarka domin wulakanta ka a gaban mutane.',
        keyHighlights: [
          'Kwashe ₦10,000 nan take a matsayin kudin aiki',
          'Ribar kashi 2% KULLUM (wanda ya haura kashi 700% a shekara)',
          'Izinin tura sakon batanci ga abokan huldarka da danginka',
          'Daukar kudi kai tsaye daga asusun bankinka ta BVN',
        ],
        wahalaClauses: [
          {
            id: 'wh-ln-ha-1',
            title: 'Wulakanta Masu Bashi ta Wayar Salula (FCCPC Ta Haramta)',
            quote: 'Borrower grants irrevocable authorization to access device contact list...',
            riskLevel: 'CRITICAL',
            explanation: 'Suna so su saci dukkan lambobin wayarka ne domin idan ka jinkirta kadan, su tura sakon batanci ga shugabanka, danginka da abokanka cewa kai barawo ne.',
            betterAlternative: 'Kada ka taba ba da izinin shiga lambobinka ga kowace manhajar bashi.',
            legalContext: 'Hukumar FCCPC ta haramta wulakanta masu bashi ta waya.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦68,400 (A kan ₦40,000 da aka samu)',
          currency: 'NGN (₦)',
          items: [
            { item: 'Adadin Bashin da aka nema', amount: '₦50,000', frequency: 'Bashi', isHiddenOrShady: false },
            { item: 'Kudin da aka cire a boye', amount: '-₦10,000', frequency: 'Cirewa', isHiddenOrShady: true },
            { item: 'Abin da ya shiga hannu', amount: '₦40,000', frequency: 'Asali', isHiddenOrShady: false },
            { item: 'Ribar kwanaki 14', amount: '₦28,400', frequency: 'Kwanaki 14', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'KADA KA YARDA DA WANNAN BASHIN! Goge wannan manhaja daga wayarka.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Don Allah ku guji wannan bashi! Za ka karbi dubu hamsin, su yanke dubu goma a baka dubu arba\'in, sannan a cikin mako biyu kacal su ce ka biya dubu sittin da takwas da dari hudu! Kuma suna so su wulakanta ka a gaban mutanenka. Kada ka yarda!',
        whatsAppShareMessage: '⚠️ *GARGADI KAN BASHIN ZALUNCI*\n\nDon Allah kada ku karbi bashin FastCash 9ja:\n• Kudin da za a baka: ₦40,000\n• Abin da za a biya cikin kwanaki 14: ₦68,400\n• Suna satar lambobin waya domin batanci\n\nHukumar FCCPC ta haramta wannan.',
      },
      igbo: {
        title: 'Usoro Mgbazinye Ego FastCash 9ja (₦50,000)',
        documentType: 'Akwụkwọ Mgbazinye Ego (Loan Agreement)',
        riskLevel: 'CRITICAL',
        riskScore: 96,
        summary: 'Ego a bụ ọnyà dị egwu! Ị chọrọ ibiri ₦50,000, ha ga-enye gị naanị ₦40,000, mana n’ime ụbọchị iri na anọ ị ga-akwụghachi ₦68,400! Ọzọkwa, ha chọrọ ikike ịbanye na nọmba ekwentị gị iji kparịa gị.',
        keyHighlights: [
          'Mwepu ₦10,000 ozugbo n’amaghị ama',
          'Ọmụrụ nwa 2% KWA ỤBỌCHỊ (karịrị 700% n’afọ)',
          'Iji nọmba ndị enyi na ndị ọrụ gị na-akparị gị',
          'Iwere ego na akaụntụ gị site na BVN na-agwa gịghị',
        ],
        wahalaClauses: [
          {
            id: 'wh-ln-ig-1',
            title: 'Ikparị Ndị Ji Ụgwọ Site na Nọmba Ekwentị (Nke FCCPC machibidoro)',
            quote: 'Borrower grants irrevocable authorization to access device contact list...',
            riskLevel: 'CRITICAL',
            explanation: 'Ha chọrọ izu ohi nọmba ekwentị gị niile ka ha nwee ike izigara onye isi gị, ndị ụka gị na ndị ezinụlọ gị ozi na ị bụ onye ohi ma ọ bụrụ na ị pụọ ntakịrị.',
            betterAlternative: 'Ekwela ka ngwa ọ bụla nweta ikike nọmba gị.',
            legalContext: 'Iwu FCCPC machibidoro ikparị ndị ji ụgwọ.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦68,400 (N’elu ₦40,000 natara)',
          currency: 'NGN (₦)',
          items: [
            { item: 'Ego Ị Chọrọ', amount: '₦50,000', frequency: 'Isi ego', isHiddenOrShady: false },
            { item: 'Ego E Wepụrụ Ozugbo', amount: '-₦10,000', frequency: 'Ụgwọ nzuzo', isHiddenOrShady: true },
            { item: 'Ego Batara n\'Aka', amount: '₦40,000', frequency: 'Net', isHiddenOrShady: false },
            { item: 'Ọmụrụ Nwa Ụbọchị 14', amount: '₦28,400', frequency: 'Ụbọchị 14', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'EKWELA N’EGO A MA ỌLỊ! Hichapụ ngwa a n’ekwentị gị.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Biko gbanahụ ego a! Ị chọrọ iri puku ise, ha ga-egbutu puku iri ozugbo nye gị puku iri anọ. Mgbe ahụ n’ime izu abụọ ha ga-achọ puku iri isii na asatọ na narị anọ! Ha chọkwara iji nọmba ekwentị gị kparịa gị. Biko ekwela!',
        whatsAppShareMessage: '⚠️ *ỊDỌ AKA NA NTỊ BANYERE EGO OHI*\n\nBiko anabatala ego FastCash 9ja a:\n• Ego ị nwetara: ₦40,000\n• Ego ị ga-akwụ n’ime ụbọchị 14: ₦68,400\n• Ha na-ezuru nọmba ekwentị iji kparịa mmadụ\n\nFCCPC amachibidola nke a.',
      },
      english: {
        title: 'FastCash 9ja Instant Loan Offer Terms (₦50,000)',
        documentType: 'Loan Agreement',
        riskLevel: 'CRITICAL',
        riskScore: 96,
        summary: 'This digital loan is a predatory trap. While requesting ₦50,000, you only receive ₦40,000 after an upfront 20% cut, yet you must repay ₦68,400 within 14 days (over 700% APR). Additionally, it demands access to your phone contacts for public harassment in event of default.',
        keyHighlights: [
          'Upfront ₦10,000 deduction disguised as processing fee',
          '2% DAILY interest rate (compounding to 730% APR)',
          'Illegal contact-list scraping and third-party shaming clause',
          'Unauthorized BVN direct debit access across all linked bank accounts',
        ],
        wahalaClauses: [
          {
            id: 'wh-ln-en-1',
            title: 'Contact Scraping & Defamation Clause (FCCPC Banned)',
            quote: 'Borrower grants irrevocable authorization to access device contact list...',
            riskLevel: 'CRITICAL',
            explanation: 'The lender harvests all device contacts to send derogatory messages to employers, pastors, and family members upon payment delay.',
            betterAlternative: 'Never grant address book permissions to mobile loan applications.',
            legalContext: 'FCCPC Limited Interim Regulatory/Registration Framework for Digital Lending outlaws contact shaming.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦68,400 (on ₦40,000 received)',
          currency: 'NGN (₦)',
          items: [
            { item: 'Nominal Loan Amount', amount: '₦50,000', frequency: 'Principal', isHiddenOrShady: false },
            { item: 'Upfront Hidden Cut', amount: '-₦10,000', frequency: 'Deduction', isHiddenOrShady: true },
            { item: 'Disbursed to Bank', amount: '₦40,000', frequency: 'Net', isHiddenOrShady: false },
            { item: '14-Day Interest & Surcharge', amount: '₦28,400', frequency: '14 Days (71% effective)', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'DO NOT ACCEPT this offer or install the APK application.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Confirm lender registration status on the official FCCPC whitelist.', priority: 'important' },
        ],
        voiceNoteScript: 'Stay away from this loan offer! For a 50,000 naira loan, they deduct 10,000 immediately, giving you only 40,000. In just two weeks, they demand 68,400 back and require permission to harass your contacts. Do not accept this agreement.',
        whatsAppShareMessage: '⚠️ *PREDATORY LOAN ALERT*\n\nPlease do not accept FastCash 9ja:\n• Net received: ₦40,000\n• Repayment in 14 days: ₦68,400\n• Scrapes phone contacts to defame borrowers\n\nExplicitly outlawed by FCCPC Nigeria.',
      },
    },
  },
  {
    id: 'sample_hospital',
    title: 'Private Specialist Clinic Emergency Admission & Surgical Bill',
    category: 'Healthcare & Hospital',
    description: 'Inflated emergency surcharge, unitemized PPE kits, and 20% administrative fee.',
    issuer: 'Apex Crest Specialist Hospital & Trauma Centre, Ikeja',
    date: '19th October 2026',
    mockRawText: `PATIENT BILLING SUMMARY & SETTLEMENT DEMAND
Patient Name: CONFIDENTIAL
Bed Nights: 2 Nights (Semi-Private Ward) @ N75,000/night = N150,000
Consultant Discretionary Emergency Callout Fee: N350,000
General Consumables & Ancillary Packs: N185,000 (Bulk charge)
Theatre Disinfection & Standby Surcharge: N120,000
Pharmacy Drugs (Generic antibiotics & fluids): N95,000
Hospital Administrative & Logistics Overhead (20%): N180,000
TOTAL AMOUNT DUE: N1,080,000.
NOTE: Hospital retains patient clinical discharge summary until full cash settlement is verified.`,
    presetAnalysis: {
      pidgin: {
        title: 'Emergency Hospital Bill (N1.08 Million)',
        documentType: 'Hospital Medical Bill',
        riskLevel: 'WARNING',
        riskScore: 74,
        summary: 'The hospital bill reach N1,080,000 for just 2 nights. Plenty phantom charges dey inside: N350k for doctor callout fee, N185k bulk consumables without breakdown, plus 20% admin tax! And dem dey threaten to hold patient discharge paper.',
        keyHighlights: [
          'N350,000 "Discretionary" doctor callout charge without agreed tariff',
          'N185,000 bulk consumables with zero itemized receipt',
          '20% administrative surcharge added on top of total bill',
          'Illegal detention of patient medical records/discharge summary',
        ],
        wahalaClauses: [
          {
            id: 'wh-hosp-1',
            title: 'Withholding Medical Discharge Summary',
            quote: 'Hospital retains patient clinical discharge summary until full cash settlement is verified.',
            riskLevel: 'CRITICAL',
            explanation: 'Medical records and discharge summary na your human right. If patient need transfer or followup treatment, hospital no fit hold clinical summary hostage.',
            betterAlternative: 'Demand clinical summary immediately under patient charter of rights; negotiate bill payment plan separately.',
            legalContext: 'Federal Ministry of Health Patients Bill of Rights guarantees right to full medical information.',
          },
          {
            id: 'wh-hosp-2',
            title: 'Unitemized N185,000 Bulk Consumables',
            quote: 'General Consumables & Ancillary Packs: N185,000 (Bulk charge)',
            riskLevel: 'WARNING',
            explanation: 'Hospitals often pack gloves, cotton wool, and syringes under bulk charge. You get right to see the exact price of every single cotton and plaster dem use.',
            betterAlternative: 'Request an itemized billing ledger showing unit quantity and cost for each consumable.',
            legalContext: 'FCCPC regulations enforce transparent price breakdown for medical services.',
          },
        ],
        financialBreakdown: {
          totalDue: 'N1,080,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Semi-Private Bed (2 Nights)', amount: '₦150,000', frequency: '2 Nights', isHiddenOrShady: false },
            { item: 'Emergency Discretionary Callout', amount: '₦350,000', frequency: 'Specialist Fee', isHiddenOrShady: true },
            { item: 'Unitemized Consumables Pack', amount: '₦185,000', frequency: 'Bulk Charge', isHiddenOrShady: true },
            { item: 'Theatre Standby Surcharge', amount: '₦120,000', frequency: 'Facility Fee', isHiddenOrShady: true },
            { item: 'Pharmacy Medications', amount: '₦95,000', frequency: 'Drugs', isHiddenOrShady: false },
            { item: '20% Admin & Logistics Overhead', amount: '₦180,000', frequency: 'Add-on Tax', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Do not pay full amount upfront. Ask for Medical Director or Accounts Desk.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Demand an itemized breakdown for the N185,000 consumables and question the 20% admin overhead.', priority: 'important' },
          { stepNumber: 3, text: 'Insist on immediate release of clinical discharge notes citing the National Patients Bill of Rights.', priority: 'important' },
        ],
        voiceNoteScript: 'My people, check this hospital bill well well. Dem put 350,000 naira for just doctor emergency callout, and 185k for consumables wey dem no even list wetin dem use. On top of that, dem add 180k admin charge! Meet the chief medical officer and demand itemized bill. You fit easily save over 300k.',
        whatsAppShareMessage: '🏥 *HOSPITAL BILL REVIEW*\n\nTotal billed: ₦1,080,000 for 2 days.\n*Issues flagged:*\n• ₦185k bulk consumables (unitemized)\n• ₦350k emergency doctor fee\n• 20% extra admin surcharge (₦180k)\n\n*Action:* Do not pay blindly. Ask for itemized printout from medical director.',
      },
      yoruba: {
        title: 'Iwe Owo Ile-Iwosan Pajawiri (₦1.08 Million)',
        documentType: 'Iwe Owo Ile-Iwosan (Hospital Bill)',
        riskLevel: 'WARNING',
        riskScore: 74,
        summary: 'Iwe owo ile-iwosan yi to ₦1,080,000 fun ojo meji pere. Owo ajeji po ninu re: ₦350,000 fun ipe dokita pajawiri, ₦185,000 fun ohun elo ti ko ni akojopo, pelu 20% owo admin! Won si tun fe da iwe idanileko alaisan duro.',
        keyHighlights: [
          '₦350,000 owo ipe dokita pajawiri ti ko ni adehun tele',
          '₦185,000 fun ohun elo itoju ti a ko to oruko won leyo kookan',
          '20% afikun owo admin lori gbogbo owo itoju',
          'Idaduro iwe itusile alaisan (discharge summary) ti o lodi si eto omoniyan',
        ],
        wahalaClauses: [
          {
            id: 'wh-hosp-yo-1',
            title: 'Idaduro Iwe Itusile Alaisan (Lodi Si Ofin)',
            quote: 'Hospital retains patient clinical discharge summary until full cash settlement is verified.',
            riskLevel: 'CRITICAL',
            explanation: 'Iwe itusile alaisan je eto re labe ofin. Ile-iwosan ko ni eto labe ofin lati da iwe itoju re duro nitori owo.',
            betterAlternative: 'Beere fun iwe itoju alaisan lẹsẹkẹsẹ labe eto alaisan (Patients Bill of Rights).',
            legalContext: 'Ofin Eto Alaisan ti Ijoba Apapo Naijiria (Patients Bill of Rights).',
          },
        ],
        financialBreakdown: {
          totalDue: '₦1,080,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Ibusun Ile-Iwosan (Ojo 2)', amount: '₦150,000', frequency: 'Ojo 2', isHiddenOrShady: false },
            { item: 'Owo Ipe Dokita Pajawiri', amount: '₦350,000', frequency: 'Apeere', isHiddenOrShady: true },
            { item: 'Ohun Elo Itoju Asepo', amount: '₦185,000', frequency: 'Asepo', isHiddenOrShady: true },
            { item: 'Owo Yara Ise-Abe', amount: '₦120,000', frequency: 'Yara', isHiddenOrShady: true },
            { item: 'Ogun lati Pharmacy', amount: '₦95,000', frequency: 'Ogun', isHiddenOrShady: false },
            { item: '20% Owo Admin', amount: '₦180,000', frequency: 'Afikun', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'E ma se san gbogbo owo leekan soso. E lo ba Oga Dokita (Medical Director).', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Beere fun akojopo ohun elo ₦185,000 leyo kookan.', priority: 'important' },
        ],
        voiceNoteScript: 'E kiyesi iwe owo ile-iwosan yi daadaa! Won fi egberun lona oodunrun ati aadota naira le e fun owo ipe dokita lasan, pelu 185,000 fun ohun elo ti won ko tile to oruko won. E lo ba Medical Director lati beere fun akojopo to daju!',
        whatsAppShareMessage: '🏥 *AYEWO IWE OWO ILE-IWOSAN*\n\nApapo owo: ₦1,080,000 fun ojo meji.\n• ₦185k ohun elo ti a ko to oruko won\n• ₦350k owo ipe dokita\n• 20% afikun owo admin (₦180k)\n\nE ma sanwo laisi akojopo to peye.',
      },
      hausa: {
        title: 'Kudin Asibiti na Gaggawa (Miliyan ₦1.08)',
        documentType: 'Takardar Kudin Asibiti (Hospital Bill)',
        riskLevel: 'WARNING',
        riskScore: 74,
        summary: 'Kudin asibitin ya kai ₦1,080,000 na kwanaki biyu kacal. Akwai kudaden bogi a ciki: ₦350,000 kudin kiran likita na gaggawa, ₦185,000 na kayan aiki ba tare da lissafi ba, tare da kashi 20% na karin kudin admin! Kuma suna barazanar rike takardar sallama.',
        keyHighlights: [
          '₦350,000 kudin kiran likita ba tare da an amince ba',
          '₦185,000 kayan magani ba tare da bayanin kowanne abu ba',
          'Karin kashi 20% na admin a kan jimillar kudi',
          'Rike takardar sallamar mara lafiya wanda ya saba doka',
        ],
        wahalaClauses: [
          {
            id: 'wh-hosp-ha-1',
            title: 'Rike Takardar Sallama (Ya Saba Dokar Lafiya)',
            quote: 'Hospital retains patient clinical discharge summary until full cash settlement is verified.',
            riskLevel: 'CRITICAL',
            explanation: 'Samun bayanan lafiyarka da takardar sallama hakkin dan adam ne. Asibiti ba shi da ikon rike takardarka saboda batun kudi.',
            betterAlternative: 'Nemi a ba ka takardar sallama nan take bisa dokar kare hakkin marasa lafiya.',
            legalContext: 'Dokar Kare Hakkin Marasa Lafiya ta Kasa (Patients Bill of Rights).',
          },
        ],
        financialBreakdown: {
          totalDue: '₦1,080,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Kudin Gado (Kwanaki 2)', amount: '₦150,000', frequency: 'Kwana 2', isHiddenOrShady: false },
            { item: 'Kudin Kiran Likita na Gaggawa', amount: '₦350,000', frequency: 'Likita', isHiddenOrShady: true },
            { item: 'Kayan Aiki da Magunguna', amount: '₦185,000', frequency: 'Dunkule', isHiddenOrShady: true },
            { item: 'Kudin Dakin Tiyata', amount: '₦120,000', frequency: 'Wuri', isHiddenOrShady: true },
            { item: 'Magungunan Pharmacy', amount: '₦95,000', frequency: 'Magani', isHiddenOrShady: false },
            { item: 'Kashi 20% na Admin', amount: '₦180,000', frequency: 'Kari', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Kada ka biya dukkan kudin nan take. Gana da Shugaban Asibitin (Medical Director).', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Nemi cikakken bayanin kowanne abu a cikin kudin ₦185,000.', priority: 'important' },
        ],
        voiceNoteScript: 'Jama\'a, ku duba wannan takardar kudin asibiti da kyau! Sun saka naira dubu dari uku da hamsin na kiran likita kawai, da dubu dari da tamanin da biyar na kayan da ba su rubuta sunansu ba. Ku gana da shugaban asibiti ku nemi cikakken lissafi kafin ku biya!',
        whatsAppShareMessage: '🏥 *BITAR KUDIN ASIBITI*\n\nJimillar kudi: ₦1,080,000 na kwana 2.\n• ₦185k kayan aiki ba tare da lissafi ba\n• ₦350k kudin kiran likita\n• 20% karin kudin admin (₦180k)\n\nKada ku biya a makance.',
      },
      igbo: {
        title: 'Ụgwọ Ụlọ Ọgwụ Mberede (₦1.08 Million)',
        documentType: 'Akwụkwọ Ụgwọ Ụlọ Ọgwụ (Hospital Bill)',
        riskLevel: 'WARNING',
        riskScore: 74,
        summary: 'Ụgwọ ụlọ ọgwụ a ruru ₦1,080,000 naanị maka abalị abụọ. Ọtụtụ ụgwọ aghụghọ dị n’ime ya: ₦350,000 maka ịkpọ dọkịta, ₦185,000 maka ngwa eji rụọ ọrụ na-enweghị ndepụta, tinyere 20% ụgwọ nchịkwa! Ha na-achọkwa ijide akwụkwọ nchụpụ onye ọrịa.',
        keyHighlights: [
          '₦350,000 ụgwọ ịkpọ dọkịta na mberede na-enweghị nkwekọrịta mbụ',
          '₦185,000 maka ngwa ọgwụ na-enweghị ndepụta otu otu',
          '20% ụgwọ nchịkwa agbakwunyere na ngụkọta',
          'Ijide akwụkwọ ndekọ ahụike nke megidere iwu',
        ],
        wahalaClauses: [
          {
            id: 'wh-hosp-ig-1',
            title: 'Ijide Akwụkwọ Nchụpụ Onye Ọrịa (Megidere Iwu)',
            quote: 'Hospital retains patient clinical discharge summary until full cash settlement is verified.',
            riskLevel: 'CRITICAL',
            explanation: 'Inweta akwụkwọ ahụike gị bụ ikike gị dịka mmadụ. Ụlọ ọgwụ enweghị ikike ijide akwụkwọ ahụike gị n’ihi ụgwọ.',
            betterAlternative: 'Chọọ ka e nye gị akwụkwọ ahụike gị ozugbo n’okpuru ikike ndị ọrịa.',
            legalContext: 'Federal Ministry of Health Patients Bill of Rights.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦1,080,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Àkwà Ụlọ Ọgwụ (Abalị 2)', amount: '₦150,000', frequency: 'Abalị 2', isHiddenOrShady: false },
            { item: 'Ụgwọ Ịkpọ Dọkịta Mberede', amount: '₦350,000', frequency: 'Ọpụrụiche', isHiddenOrShady: true },
            { item: 'Ngwa Ọrụ Aghọtaghị', amount: '₦185,000', frequency: 'Nchịkọta', isHiddenOrShady: true },
            { item: 'Ụlọ Ịwa Ahụ', amount: '₦120,000', frequency: 'Ebe', isHiddenOrShady: true },
            { item: 'Ọgwụ Si na Ụlọ Ọgwụ', amount: '₦95,000', frequency: 'Ọgwụ', isHiddenOrShady: false },
            { item: '20% Ụgwọ Nchịkwa', amount: '₦180,000', frequency: 'Mgbakwunye', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Akwụla ego niile ozugbo. Hụ onye isi ụlọ ọgwụ (Medical Director).', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Chọọ ka e nye gị ndepụta nke ngwa ₦185,000 otu otu.', priority: 'important' },
        ],
        voiceNoteScript: 'Ndị be anyị, lelee akwụkwọ ụgwọ ụlọ ọgwụ a nke ọma! Ha tinyere puku narị atọ na iri ise maka ịkpọ dọkịta, na puku narị na iri asatọ na ise maka ihe ha na-edepụtaghị. Gakwuru onye isi dọkịta ma rịọ maka ndepụta zuru oke!',
        whatsAppShareMessage: '🏥 *NYOCHA ỤGWỌ ỤLỌ ỌGWỤ*\n\nNgụkọta: ₦1,080,000 maka abalị 2.\n• ₦185k ngwa na-enweghị ndepụta\n• ₦350k ụgwọ dọkịta\n• 20% ụgwọ nchịkwa (₦180k)\n\nAkwụla ụgwọ n’amaghị ama.',
      },
      english: {
        title: 'Emergency Admission & Surgical Bill (₦1.08 Million)',
        documentType: 'Hospital Bill',
        riskLevel: 'WARNING',
        riskScore: 74,
        summary: 'This hospital bill totals ₦1,080,000 for a 2-night admission. Several disputed charges appear: an unagreed ₦350,000 emergency doctor callout, ₦185,000 in unitemized bulk consumables, plus an arbitrary 20% administrative overhead surcharge. The hospital also unlawfully threatens to withhold patient clinical discharge records.',
        keyHighlights: [
          '₦350,000 "Discretionary" emergency doctor callout fee without prior tariff',
          '₦185,000 in unitemized bulk surgical consumables',
          '20% administrative surcharge added to the overall subtotal',
          'Unlawful retention of clinical patient medical records',
        ],
        wahalaClauses: [
          {
            id: 'wh-hosp-en-1',
            title: 'Unlawful Withholding of Clinical Discharge Records',
            quote: 'Hospital retains patient clinical discharge summary until full cash settlement is verified.',
            riskLevel: 'CRITICAL',
            explanation: 'Under Nigerian law, healthcare facilities cannot hold medical records hostage over billing disputes.',
            betterAlternative: 'Demand immediate release of the clinical summary citing the Patients Bill of Rights.',
            legalContext: 'Federal Ministry of Health Patients Bill of Rights.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦1,080,000',
          currency: 'NGN (₦)',
          items: [
            { item: 'Semi-Private Room (2 Nights)', amount: '₦150,000', frequency: '2 Nights', isHiddenOrShady: false },
            { item: 'Emergency Doctor Callout', amount: '₦350,000', frequency: 'Specialist Fee', isHiddenOrShady: true },
            { item: 'Unitemized Consumables Pack', amount: '₦185,000', frequency: 'Bulk Charge', isHiddenOrShady: true },
            { item: 'Theatre Standby Surcharge', amount: '₦120,000', frequency: 'Facility Fee', isHiddenOrShady: true },
            { item: 'Pharmacy Medications', amount: '₦95,000', frequency: 'Medications', isHiddenOrShady: false },
            { item: '20% Administrative Overhead', amount: '₦180,000', frequency: 'Add-on Tax', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Do not pay the full demanded balance upfront. Meet with the Medical Director.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Request an itemized billing ledger for the ₦185,000 consumable pack.', priority: 'important' },
        ],
        voiceNoteScript: 'Please review this hospital bill carefully before making payment. They have included 350,000 naira for a doctor emergency fee, and 185,000 naira in unitemized consumables. Request an itemized printout from the Medical Director to remove questionable surcharges.',
        whatsAppShareMessage: '🏥 *HOSPITAL BILL REVIEW*\n\nTotal: ₦1,080,000 for 2 days.\n• ₦185k unitemized bulk charges\n• ₦350k discretionary doctor fee\n• 20% administrative surcharge\n\nRequest an itemized invoice before settlement.',
      },
    },
  },
  {
    id: 'sample_school',
    title: 'University Faculty & Departmental Sundry Levies Notice',
    category: 'Education & Fees',
    description: 'Compulsory departmental levies with 7-day forfeiture threat and non-receipted dues.',
    issuer: 'Faculty of Social Sciences & Management Studies, State University',
    date: '10th October 2026',
    mockRawText: `MANDATORY FACULTY CLEARANCE & SUNDRY DUES CIRCULAR
To all Returning and Fresh Undergraduate Students:
1. Faculty Development Infrastructure Levy: N45,000 (Payable directly to Faculty Association Zenith Bank Account, non-remitted to portal).
2. Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).
3. Student Association Excursion & Dinner Levy: N18,500.
4. Late Course Clearance Penalty: N15,000 per week.
DEADLINE: All students must produce stamped bank tellers within seven (7) working days, failing which matriculation numbers shall be revoked and semester exams debarred without appeal.`,
    presetAnalysis: {
      pidgin: {
        title: 'Faculty Sundry Levies & Dues (N108,500)',
        documentType: 'University School Fee Notice',
        riskLevel: 'WARNING',
        riskScore: 78,
        summary: 'Dem dey ask students make dem pay N45k into association private bank account and N30k CASH in HOD office! The threat say you go lose admission inside 7 days na illegal pressure tactics.',
        keyHighlights: [
          'Mandatory cash payments into departmental office without university portal remita receipt',
          'Payments directed into private union account instead of TSA/University treasury',
          '7-day revocation threat designed to cause panic',
          'Non-refundable dinner/excursion fee forced on all students',
        ],
        wahalaClauses: [
          {
            id: 'wh-sch-1',
            title: 'Cash Payment at HOD Office (No Remita / TSA Receipt)',
            quote: 'Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).',
            riskLevel: 'CRITICAL',
            explanation: 'NUC (National Universities Commission) forbid lecturers and HODs from selling handouts or collecting cash in offices. If you pay cash, no university record dey protect you.',
            betterAlternative: 'Pay only through the university official portal or Remita TSA code.',
            legalContext: 'Federal Government Treasury Single Account (TSA) directive and NUC ban on cash collections.',
          },
        ],
        financialBreakdown: {
          totalDue: 'N108,500',
          currency: 'NGN (₦)',
          items: [
            { item: 'Faculty Infrastructure Levy', amount: '₦45,000', frequency: 'Association Account', isHiddenOrShady: true },
            { item: 'Handout Resource Package', amount: '₦30,000', frequency: 'Cash in Office', isHiddenOrShady: true },
            { item: 'Dinner & Excursion Fee', amount: '₦18,500', frequency: 'Optional made mandatory', isHiddenOrShady: true },
            { item: 'Late Penalty Risk', amount: '₦15,000/week', frequency: 'Penalty', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Do not pay cash in any office without official university stamped receipt.', priority: 'must_do_first' },
          { stepNumber: 2, text: 'Report through SUG (Student Union Government) or Dean of Student Affairs.', priority: 'important' },
        ],
        voiceNoteScript: 'Students, listen well well! Any money wey dem tell you make you pay cash for office or pay into association private account, hold your hand first. University circular say all school payments must pass through official school portal or Remita. No let anybody panic you with 7 days threat!',
        whatsAppShareMessage: '📚 *VARSITY DUES ALERT*\n\nPlease warn students regarding the new faculty circular:\n• ₦30k cash at HOD office is against NUC rules\n• ₦45k into private union account is suspicious\n• 7-day admission loss threat is illegal coercion\nAlways pay through verified university portal only.',
      },
      yoruba: {
        title: 'Iwe Owo Dues ati Owo Eka Eko Yunifasiti (₦108,500)',
        documentType: 'Iwe Owo Yunifasiti (School Notice)',
        riskLevel: 'WARNING',
        riskScore: 78,
        summary: 'Won n bere owo lowo awon akekoo lati san ₦45,000 sinu akopọ banki egbe ati ₦30,000 OWO OWO (Cash) ni ofisi HOD! Irokeke pe won ma gba matriculation number lowo eniyan laarin ojo meje (7) je etan ati eru lodi si ofin.',
        keyHighlights: [
          'Gbigba owo owo (cash) ni ofisi laisi iwe-owo portal remita ti yunifasiti',
          'Sisanwo sinu akopọ ikoko egbe dipo ti ile-iwe',
          'Irokeke gbigba admission laarin ojo meje lati daamu akekoo',
        ],
        wahalaClauses: [
          {
            id: 'wh-sch-yo-1',
            title: 'Sisan Owo Owo (Cash) ni Ofisi HOD (Lodi Si Ofin NUC)',
            quote: 'Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).',
            riskLevel: 'CRITICAL',
            explanation: 'Ajo NUC ti fofin de tita iwe handout ati gbigba owo owo ni ofisi awon oluko. Ti o ba san owo owo, ko si eri osise to n daabobo e.',
            betterAlternative: 'Sanwo nikan nipase portal osise ti ile-iwe tabi Remita.',
            legalContext: 'Ilana Treasury Single Account (TSA) ati ofin NUC.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦108,500',
          currency: 'NGN (₦)',
          items: [
            { item: 'Owo Idagbasoke Faculty', amount: '₦45,000', frequency: 'Akopo Egbe', isHiddenOrShady: true },
            { item: 'Owo Handout ni Ofisi HOD', amount: '₦30,000', frequency: 'Owo Owo (Cash)', isHiddenOrShady: true },
            { item: 'Owo Dinner Akekoo', amount: '₦18,500', frequency: 'Apeere', isHiddenOrShady: true },
            { item: 'Itanran Ipẹ', amount: '₦15,000/ose', frequency: 'Itanran', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'E MA SAN OWO OWO (Cash) ni ofisi kankan laisi iwe-owo portal.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Awon akekoo, e gbo daadaa! Owo kankan ti won ba ni ki e san ni owo owo (cash) ni ofisi tabi sinu akopo egbe, e dawo duro na. Ilana ile-iwe so pe gbogbo owo gbodo gba ori portal osise tabi Remita koja. E ma je ki enikankan dẹruba yin!',
        whatsAppShareMessage: '📚 *IKILỌ PATAKI FUN AKEEKOO*\n\nE kilo fun awon akekoo lori iwe circular tuntun yi:\n• ₦30k owo owo ni ofisi HOD lodi si ofin NUC\n• ₦45k sinu akopo banki egbe ko ye koro\n• Irokeke ojo 7 lodi si ofin\nE sanwo lori portal osise nikan.',
      },
      hausa: {
        title: 'Kudaden Dues na Tsangayar Jami\'a (₦108,500)',
        documentType: 'Sanarwar Kudin Jami\'a (School Notice)',
        riskLevel: 'WARNING',
        riskScore: 78,
        summary: 'Suna neman dalibai su biya ₦45,000 a asusun kungiya na sirri da kuma ₦30,000 TSABAR KUDI (Cash) a ofishin HOD! Barazanar cewa za a kwace lambar matriculation a cikin kwanaki 7 dabara ce ta firgita da ta saba doka.',
        keyHighlights: [
          'Biyan tsabar kudi a ofishin sashe ba tare da shaidar Remita ba',
          'Biya a asusun kungiya maimakon asusun jami\'a na TSA',
          'Barazanar kwace admission a cikin kwanaki 7',
        ],
        wahalaClauses: [
          {
            id: 'wh-sch-ha-1',
            title: 'Biyan Tsabar Kudi a Ofishin HOD (NUC Ta Haramta)',
            quote: 'Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).',
            riskLevel: 'CRITICAL',
            explanation: 'Hukumar NUC ta haramta karbar tsabar kudi ko siyar da handouts a ofisoshin malamai. Biyan tsabar kudi yana hana ka samun kariya ta doka.',
            betterAlternative: 'Kada ka biya kudi sai ta hanyar portal na jami\'a ko Remita.',
            legalContext: 'Dokar Tsarin Asusun Gwamnati (TSA) da ka\'idojin NUC.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦108,500',
          currency: 'NGN (₦)',
          items: [
            { item: 'Kudin Ci Gaban Tsangaya', amount: '₦45,000', frequency: 'Asusun Kungiya', isHiddenOrShady: true },
            { item: 'Kudin Handout a Ofis', amount: '₦30,000', frequency: 'Tsabar Kudi (Cash)', isHiddenOrShady: true },
            { item: 'Kudin Dinner na Dalibai', amount: '₦18,500', frequency: 'Kari', isHiddenOrShady: true },
            { item: 'Kudin Tara na Jinkiri', amount: '₦15,000/mako', frequency: 'Tara', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'KADA KA BIYA TSABAR KUDI a kowane ofis ba tare da rasitin portal ba.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Dalibai ku saurara da kyau! Duk wani kudi da aka ce ku biya tsabar kudi a ofis ko ku tura a asusun kungiya, ku dakata tukuna. Dokar jami\'a ta ce dukkan kudi dole ne su bi ta portal na jami\'a ko Remita. Kada ku yarda da barazanar kwanaki bakwai!',
        whatsAppShareMessage: '📚 *GARGADI GA DALIBAI*\n\nKu gargadi dalibai game da wannan sanarwa:\n• ₦30k tsabar kudi a ofishin HOD ya saba dokar NUC\n• ₦45k a asusun kungiya ba shi da inganci\n• Barazanar kwanaki 7 ba daidai ba ce\nKu biya ta portal na jami\'a kawai.',
      },
      igbo: {
        title: 'Ụgwọ Dues nke Ngalaba Mahadum (₦108,500)',
        documentType: 'Ọkwa Ụgwọ Akwụkwọ (School Notice)',
        riskLevel: 'WARNING',
        riskScore: 78,
        summary: 'Ha na-arịọ ụmụ akwụkwọ ka ha kwụọ ₦45,000 n’ime akaụntụ otu nkeonwe yana ₦30,000 EGO AKWỤKWỌ N’AKA (Cash) n’ọfịs HOD! Egwu na a ga-anapụ mmadụ nọmba nnabata n’ime ụbọchị asaa (7) bụ aghụghọ megidere iwu.',
        keyHighlights: [
          'Ịkwụ ụgwọ ego n’aka n’ọfịs na-enweghị rasiti portal nke mahadum',
          'Ịkwụ ụgwọ n’akaụntụ otu kama nke mahadum',
          'Egwu ịpụnara mmadụ nnabata n’ime ụbọchị 7',
        ],
        wahalaClauses: [
          {
            id: 'wh-sch-ig-1',
            title: 'Ịkwụ Ego n\'Aka n\'Ọfịs HOD (Nke NUC machibidoro)',
            quote: 'Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).',
            riskLevel: 'CRITICAL',
            explanation: 'NUC machibidoro ndị nkuzi ire handouts ma ọ bụ ịnara ego n’aka n’ọfịs. Ịkwụ ego n’aka anaghị enye gị nchebe iwu.',
            betterAlternative: 'Kwụọ ụgwọ naanị site na portal gọọmentị ma ọ bụ Remita.',
            legalContext: 'Iwu Treasury Single Account (TSA) na NUC.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦108,500',
          currency: 'NGN (₦)',
          items: [
            { item: 'Ụgwọ Mmepe Faculty', amount: '₦45,000', frequency: 'Akaụntụ Otu', isHiddenOrShady: true },
            { item: 'Ụgwọ Handout n\'Ọfịs', amount: '₦30,000', frequency: 'Ego n\'Aka (Cash)', isHiddenOrShady: true },
            { item: 'Ụgwọ Nri Anyasị', amount: '₦18,500', frequency: 'Mgbakwunye', isHiddenOrShady: true },
            { item: 'Ụgwọ Ntaramahụhụ', amount: '₦15,000/izu', frequency: 'Ntaramahụhụ', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'AKWỤLA EGO N’AKA n’ọfịs ọ bụla na-enweghị rasiti portal.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Ụmụ akwụkwọ, gee ntị nke ọma! Ego ọ bụla a gwara gị kwụọ n’aka n’ọfịs ma ọ bụ kwụọ n’akaụntụ otu, kwụsịtụ mbụ. Iwu mahadum kwuru na ụgwọ niile ga-esi na portal gọọmentị ma ọ bụ Remita. Ekwela ka egwu ụbọchị asaa tụọ gị!',
        whatsAppShareMessage: '📚 *ỊDỌ AKA NA NTỊ MAKA ỤMỤ AKWỤKWỌ*\n\nBiko dọọ ụmụ akwụkwọ aka na ntị:\n• ₦30k ego n’aka n’ọfịs HOD megidere iwu NUC\n• ₦45k n’akaụntụ otu na-enyo enyo\n• Egwu ụbọchị 7 adịghị mma\nKwụọ ụgwọ naanị site na portal.',
      },
      english: {
        title: 'Faculty Clearance & Sundry Levies Notice (₦108,500)',
        documentType: 'University Fee Notice',
        riskLevel: 'WARNING',
        riskScore: 78,
        summary: 'This faculty circular demands students pay ₦45,000 into a private association bank account and ₦30,000 CASH directly in the HOD office. The ultimatum threatening revocation of matriculation numbers within 7 days is unlawful coercive pressure.',
        keyHighlights: [
          'Mandatory cash collections in departmental office bypassing official portals',
          'Payments directed into private union accounts rather than university TSA treasury',
          '7-day matriculation revocation threat designed to induce panic',
        ],
        wahalaClauses: [
          {
            id: 'wh-sch-en-1',
            title: 'Unlawful Cash Collection at HOD Office',
            quote: 'Departmental Handout & Resource Package: N30,000 (Cash only at HOD Office).',
            riskLevel: 'CRITICAL',
            explanation: 'The National Universities Commission (NUC) expressly prohibits cash collections and forced handout sales by academic staff.',
            betterAlternative: 'Pay exclusively through the accredited university portal or Remita TSA code.',
            legalContext: 'Federal Government Treasury Single Account (TSA) directive and NUC guidelines.',
          },
        ],
        financialBreakdown: {
          totalDue: '₦108,500',
          currency: 'NGN (₦)',
          items: [
            { item: 'Faculty Infrastructure Levy', amount: '₦45,000', frequency: 'Association Account', isHiddenOrShady: true },
            { item: 'Handout Resource Package', amount: '₦30,000', frequency: 'Cash in Office', isHiddenOrShady: true },
            { item: 'Dinner & Excursion Fee', amount: '₦18,500', frequency: 'Optional fee made compulsory', isHiddenOrShady: true },
            { item: 'Late Penalty Risk', amount: '₦15,000/week', frequency: 'Penalty', isHiddenOrShady: true },
          ],
        },
        actionSteps: [
          { stepNumber: 1, text: 'Do not pay cash in any staff office without an official portal invoice.', priority: 'must_do_first' },
        ],
        voiceNoteScript: 'Students, please take note! Do not pay cash in any office or transfer funds into private association bank accounts. Official university regulations mandate that all school fees must be paid through the official portal or Remita. Do not let 7-day deadlines panic you.',
        whatsAppShareMessage: '📚 *STUDENT DUES ADVISORY*\n\nPlease inform fellow students:\n• ₦30k cash at HOD office violates NUC regulations\n• ₦45k into association accounts is non-standard\n• 7-day forfeiture threats are unenforceable\nAlways pay via verified portals only.',
      },
    },
  },
];
