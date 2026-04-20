import { useState } from "react";

const COLORS = {
  head:"#378ADD", cervical:"#1D9E75", thorax:"#D85A30", spine:"#BA7517",
  shoulder:"#7F77DD", elbow:"#85B7EB", wrist_hand:"#D4537E", pelvis:"#993C1D",
  hip_thigh:"#5DCAA5", knee:"#EF9F27", lower_leg:"#534AB7", ankle:"#1D9E75", foot:"#ED93B1"
};
const LABELS = {
  head:"Hoved, ansigt & øjne", cervical:"Columna cervicalis", thorax:"Thorax",
  spine:"Columna thoracolumbalis", shoulder:"Skulder & overarm",
  elbow:"Albue & underarm", wrist_hand:"Håndled, hånd & fingre", pelvis:"Bækken",
  hip_thigh:"Hofte & lår", knee:"Knæ", lower_leg:"Underben & achilles",
  ankle:"Ankel", foot:"Fod & tæer"
};
const SHAPES = {
  head:[{t:"e",cx:120,cy:40,rx:28,ry:33}],
  cervical:[{t:"p",d:"108,74 132,74 133,93 107,93"}],
  thorax:[{t:"p",d:"71,92 169,92 167,190 73,190"}],
  spine:[{t:"p",d:"112,92 128,92 127,244 113,244"}],
  shoulder:[{t:"p",d:"71,92 44,102 33,174 64,174 73,135"},{t:"p",d:"169,92 196,102 207,174 176,174 167,135"}],
  elbow:[{t:"p",d:"33,174 64,174 61,257 28,257"},{t:"p",d:"176,174 207,174 212,257 179,257"}],
  wrist_hand:[{t:"p",d:"25,257 62,257 60,301 21,301"},{t:"p",d:"178,257 215,257 219,301 180,301"}],
  pelvis:[{t:"p",d:"73,190 167,190 171,244 69,244"}],
  hip_thigh:[{t:"p",d:"69,244 119,244 116,393 63,393"},{t:"p",d:"121,244 171,244 177,393 124,393"}],
  knee:[{t:"p",d:"61,393 117,393 114,431 57,431"},{t:"p",d:"123,393 179,393 183,431 126,431"}],
  lower_leg:[{t:"p",d:"56,431 113,431 110,546 51,546"},{t:"p",d:"127,431 184,431 189,546 130,546"}],
  ankle:[{t:"p",d:"49,544 112,544 111,572 46,572"},{t:"p",d:"128,544 191,544 194,572 129,572"}],
  foot:[{t:"p",d:"40,573 113,573 113,598 40,598"},{t:"p",d:"127,573 200,573 200,598 127,598"}],
};
const ORDER = ["thorax","pelvis","hip_thigh","knee","lower_leg","ankle","foot","shoulder","elbow","wrist_hand","head","cervical","spine"];

// Each diagnosis can have an optional `holbaek` field with {tx?, fu?, notes?}
// If present, its values override the defaults when Holbæk is selected.
const DATA = {
  head:[
    {n:"Hovedtraume", icd:"DS09.9",
      tx:"S100b skal bestilles som akut blodprøve.\nEbrierede patienter med hovedtraume: CT-c + CT columna cervicalis på særlig lav indikation!\n\nCTC UDEN BLØDNING: Se D4 instruks 502868 for observationsparametre og observationsintervaller.\n\nCTC MED BLØDNING: Du ringes op af radiologen. Overfør billeder til RH (best. ord ekstern overførsel + informer rtg afd.). Ring neurokirurgisk RH mhp. behandlingstilbud. \n\nHvis nej →  neurologisk Roskilde mhp. overflytning + observation \n\nHvis også nej (burde helst ikke ske), konf. egen akut BV. mhp. samme",
      holbaek:{
        tx:"Der bruges ikke serum-S100B på Holbæk.\nEbrierede patienter med hovedtraume: CT-c + CT columna cervicalis på særlig lav indikation!\nBørn <2 år skal til børnemodtagelsen.\n\n\n\nCTC UDEN BLØDNING: Se D4 instruks 502868 for observationsparametre og observationsintervaller.\n\nCTC MED BLØDNING: Du ringes op af radiologen. Overfør billeder til RH (best. ord ekstern overførsel + informer rtg afd.). Ring neurokirurgisk RH mhp. behandlingstilbud. \n\nHvis nej →  neurologisk Roskilde mhp. overflytning + observation \n\nHvis også nej (burde helst ikke ske), konf. egen akut BV. mhp. samme. \n\nSe i øvrigt tværregional instruks for Commotio cerebri.",
      }
    },
    {n:"F. nasi",icd:"DS02.2",
      tx:"Rtg. kun ved mistanke om anden fraktur. Behandles ikke akut. Iskompres og smertestillende.",
      fu:"Kontrol ØNH 7-10 dage mhp. evt. reponering.",
      holbaek:{
        tx:"Klinisk diagnose ved næsedeviation – ingen indikation for røntgen.\nKontrol og evt. reposition i ØNH amb efter 3-5 dage. Informer om at medbringe vellignende pasfoto/billede fra før skaden.\n\nVigtigst: udeluk septumhæmatom med anterior rhinoskopi – 6 timers tidsgrænse for evakuering. Septumhæmatom føles blødt. Kontakt vagthavende ØNH.\n\nVed åben fraktur: profylaktisk tbl. penicillin 1 MIE × 3 engangs (skade <2 timer). Ved >2 timer: i 3 dage. Undgå at suturere i brusk.",
        fu:"Kontrol ØNH amb 3-5 dage.",
      }
    },
    {n:"Epistaxis",
      tx:"Kompression 10-15 min. Merocel-tampon med NaCl. AB under pakke (Phenoxymetylpenicillin). Bagre epistaxis: kontakt ØNH.",
      fu:"Fjernelse af pakke efter 2-3 dage."},
    {n:"Øjenskader",
      tx:"Svejseøjne/abrasio cornea: bedøvende dråber + NSAID-dråber + mørke + kloramfenikol øjensalve. Syre/base ætsning: SKYL MINDST 1 TIME. Akut øjenlæge.",
      fu:"Akut øjenlæge ved ætsning eller gennemtrængende skade."},
    {n:"F. mandibulae / maxillae",icd:"DS02.6",
      tx:"Rtg. (OPG, Waters). Kæbekirurg vurdering. Behandles oftest operativt.",
      fu:"Kæbekirurg akut/subakut.",
      holbaek:{
        tx:"Undersøg hæmatomdannelse i og udenfor munden, malokklusion, nedsat gabeevne (trismus), spring i tandrækken, løsnede tænder.\nDiagnosen stilles på CT af ansigtsskelet eller ortopan rtg. Konferer kæbekirurgisk afd./ØNH. Oftest operation.\n\nF. maxillae: Ofte dobbeltsidig. CT ansigtsskelet. Konferer kæbekirurgisk afd./ØNH.\n\nF. os zygoma: Undersøg gabeevne, malokklusion, sensoriske udfald under orbita. CT ansigtsskelet. Konferer kæbekirurgisk afd./ØNH.\n\nOrbita/blowout fraktur: Se efter hævelse, misfarvning, enophthalmus, synsforstyrrelser, subkonjunktival blødning. CT ansigtsskelet. Konferer ØNH. Ved bulbus skade: kontakt øjenlæge.",
        fu:"Kæbekirurg akut/subakut.",
      }
    },
    {n:"Haematoma auris",icd:"DS00.4",
      tx:"Punktur og kompressionsbandage. Undgå blodansamling mhp. brusk destruktion.",
      fu:"ØNH kontrol 24-48 timer."},
  ],
  cervical:[
    {n:"Distorsio columnae cervicalis (piskesmæld)",icd:"DS13.4",
      tx:"Ingen immobilisering. Aktiv tidlig mobilisering. NSAID og paracetamol. Evt. kortvarig blød halskrave max 3-5 dage. Fysioterapi. Ingen rutinemæssig rtg.",
      fu:"EL ved vedvarende gener.",
      holbaek:{
        tx:"Forstrækning af bløddele omkring cervical columna. Neurologisk undersøgelse IA. Røntgen IA.\nBehandling: paracetamol 1g × 4, ibuprofen 400mg × 3, evt. klorzoxazon.\nModerat motion er sandsynligvis bedste behandling. Undgå komplet hvile.\nRemission for ¾ indenfor ca. 4 uger.",
        fu:"Ingen kontrol.",
      }
    },
    {n:"F. columnae cervicalis",icd:"DS12",
      tx:"AKUT: Stiv Philadelphia halskrave straks. Rygimmobilisation. CT-skanning columna cervicalis. MR ved neurologisk deficit. Kontakt rygvagt akut. Indlæggelse.",
      fu:"Indlæggelse. Rygvagt vurderer.",
      holbaek:{
        tx:"Mistanke: relevant traume, palpationsøm over vertebrae, bankeømhed over proc. spinosi, øm paravertebral muskulatur. Neurologiske udfald → stiv halskrave (ellers ikke).\nVær opmærksom på ældre skrøbelige patienter.\nUdfør neurologisk undersøgelse inkl. perianal sensibilitet, sphinktertonus og sphinkter-refleks.\nBilleddiagnostik vurderes ud fra Canadian C-Spine Rule. CT primært ved mistanke om cervikal fraktur.\nKonferer neurokirurgisk vagthavende RH/OUH ved fraktur eller neurologisk udfald. (Husk at overføre billeder.)",
        fu:"Konservative kontrolleres med rtg. efter 2, 6 og 12 uger. Foret halskrave anlægges. Udlever folder.",
      }
    },
  ],
  thorax:[
    {n:"F. costae",icd:"DS22.3",
      tx:"1-2 ribben, upåvirket: NSAID + paracetamol, ingen bandagering. Rtg. thorax ved mistanke om pneumothorax/hæmothorax. Indlæggelse ved ≥3 frakturer, ældre/KOL/dyspnø, eller pneumo/hæmothorax.",
      fu:"Ingen rutinemæssig kontrol ved 1-2 ribben.",
      holbaek:{
        tx:"1-2 costafrakturer: konservativ behandling med paracetamol, NSAID, tramadol. Informer om vigtigheden af adekvat smertedækning for at undgå pneumoni.\nRtg. thorax for at udelukke pneumo- og hæmothorax.\nVed ≥3 frakturer synligt på rtg.: overvej CT mhp. pneumo-/hæmothorax, flail chest, subkutant emfysem.\nVed mistanke om abdominal eller intrathorakale komplikationer: kontakt p-kir.",
        fu:"Ingen kontrol.",
      }
    },
    {n:"F. sternum",icd:"DS22.2",
      tx:"Lateral rtg. + EKG. Udisloceret, normal EKG: smertestillende, ingen bandagering. Disloceret eller EKG-forandringer/forhøjet troponin: indlæggelse til observation.",
      fu:"EL kontrol.",
      holbaek:{
        tx:"Typisk høj energi traumer. Optag EKG, mål TNI.\nKan eventuelt ses på rtg. sidebillede. Ofte behov for CT-scanning.\nFølgende skal i telemetri 24 timer: iskæmisk hjertesygdom, alder >65 år og/eller digoxinbehandling.\nOBS: ofte også intrathorakale og abdominale læsioner.",
        fu:"Ingen kontrol.",
      }
    },
  ],
  spine:[
    {n:"F. columnae thoracalis/lumbalis",icd:"DS22.0/DS32",
      tx:"CT-skanning af frakturregion. Stabil (anterior kompressionsfraktur <50%, ingen neuro): smertestillende, mobilisering, evt. korset. Ustabil/neurologisk: immobilisation + rygvagt AKUT.",
      fu:"Rygamb. 6 uger.",
      holbaek:{
        tx:"Oversete frakturer i columna er en af de hyppigste årsager til patientklager! Ofte overvurderes værdien af klinik og røntgen – ved tvivl: CT.\nMistanke: relevant traume, palpationsøm over vertebrae, bankeømhed, øm paravertebral muskulatur. Neurologiske udfald → stabilisering.\nVær opmærksom på ældre skrøbelige patienter og mb. Bechterew.\nUdfør neurologisk undersøgelse: pareser, dybe reflekser, sensibilitet, sphinktertonus.\n\nThoracalis: stabile → indlæggelse til smertebehandling og mobilisering. Neurologisk deficit → konf. RH/OUH neurokirurgisk. Ustabile → konf. rygvagten RH/OUH.\nLumbalis: stabile → mobilisering ved 3-punkts korset anlagt af fysioterapeut. Ustabile → OP på RH/OUH.\nVed medullær påvirkning eller cauda equina: kontakt RH/OUH neurokirurgisk vagthavende akut.",
        fu:"Konservative behandles med korset og kontrolleres med rtg. efter 2, 6 og 12 uger.",
      }
    },
    {n:"Akut diskusprolaps",icd:"DM51.1",
      tx:"Smertebehandling + aktiv mobilisering. MR ved neurologiske udfald. Cauda equina (blære/tarm-parese, sadelbedøvelse): akut MR + akut rygkir./neurolog.",
      fu:"EL. Henvisning ved manglende bedring 4-6 uger.",
      holbaek:{
        tx:"Diagnosen stilles klinisk ved ischias-smerter i et ben.\nTypiske neurologiske udfald svt. nerverod: radikulerende smerter, sensibilitetsforstyrrelser, positiv Lasègues test, evt. let parese.\n\nRodaffektion:\nL4: smerter/ændret sensibilitet på forlår/medialside underben, nedsat knæekstension, svækket patellareflex.\nL5: smerter/ændret sensibilitet lateralside underben + 1. tå, dropfod, svækket medial hasereflex.\nS1: smerter/ændret sensibilitet på bagsiden af lår/læg, nedsat plantarfleksion (tågang), svækket achillesreflex.\n\nBehandling: paracetamol 1g × 4, ibuprofen 600mg × 3, evt. tramadol + klorzoxazon. Benign prognose. Kontakt fysioterapeut.\nSkal primært ikke indlægges. Indlægges ikke i ort. kir. – medicinsk diagnose.\n\nUdeluk Cauda Equina: sadelbedøvelse, svækket anokutan refleks, påvirket blære-/analsphinkter. Ved påvirkning: indlæg akut til scanning og vurdering ved videncenter for rygsygdomme.",
        fu:"Patienten henvises til privatpraktiserende fysioterapeut via egen læge.",
      }
    },
  ],
  shoulder:[
    {n:"F. claviculae",icd:"DS02.0",
      tx:"Udisloceret: Løs mitella 3-6 uger + smertestillende. Må max bære op til en karton mælk \nDisloceret: OBS pneumothorax! Ellers samme som udisloceret.  \nSvær disloceret: ort. kir. vurdering.",
      fu:"Disloceret: Rtg. + KK 3 uger i ort kir amb.",
      holbaek:{
        tx:"Midtskaft, udisloceret: løs mitella / collar n' cuff til smertefrihed (2-3 uger). Undgå tunge løft.\nMidtskaft, disloceret: OBS pneumothorax! Løs mitella / collar n' cuff. Paracetamol + NSAID hvis tåles.\nDisloceret >1 knoglebredde med større intermediært fragment: kontakt Ort Kir.\nOP-indikation: åben fraktur, truet hud, kar-/nervepåvirkning, floating shoulder.\n\nGenoptrænningsplan (konservativ):\n0-3 uger: ingen bevægelighed bortset fra pendul-sving.\n3-6 uger: aktiv ubelastet bevægelighed.\n6-10 uger: langsomt progredierende belastning.\n\nLateral klavikelfraktur, udisloceret: løs mitella 2-3 uger.\nLateral klavikelfraktur, disloceret: kontakt ort kir mv. mhp. konference om operation.",
        fu:"Udisloceret: ingen kontrol. Disloceret: Ort kir + rtg. 3 uger. Henvisning til kommunal fys via GOP.",
      }
    },
    {n:"Lux. art. humeroscapularis",icd:"DS43.0",
      tx:"Reponering (Cunningham/Kocher/Milch). Rtg. FØR og EFTER. Slynge 3 uger. Primær luksation <30 år: idrætsamb. Recidivluksation <40 år med OP-ønske: idrætsamb.",
      fu:"Primær <30 år → idrætsamb. Øvrige → EL.",
      holbaek:{
        tx:"Rtg. + NVF før og efter reponering. OBS n. axillaris og n. musculocutaneus.\nSe efter afsprængning af tuberculum majus, Hill Sachs læsion og ossøs Bankart læsion. Ved fraktur/afrivning af cavitas: CT efter reponering.\n\nReponering så skånsomt og hurtigt som muligt. Overvej Nørgaards, Hipokrates, Kocher, Cunninghams eller Sool's metoder. Atraumatiske metoder kan lykkes uden eller med minimal rus/anæstesi. Evt. intraartikulær lokalbedøvelse.\n\nOBS rotator cuff læsion.\nBageste luksation (sjælden, typisk ved epileptisk anfald): overvej CT, udadrotationsbandage (fx Ultrasling) 3 uger.",
        fu:"Collar n' cuff som smertedækning 1-3 uger + øvelser. Kontrol i amb. 10-14 dage mhp. rotator cuff. Ved tuberculum major fraktur: kontrol inkl. rtg. 2 uger.",
      }
    },
    {n:"Lux. art. acromioclavicularis",icd:"DS43.1",
      tx:"Grad 1-2: slynge 2-3 uger + smertestillende. Grad 3 (komplet): slynge 3-6 uger, ort. kir. vurdering ved OP-ønske.",
      fu:"Ort. amb. ved manglende bedring.",
      holbaek:{
        tx:"Type 1-2 samt grad 3 ved pt. >60 år: collar n' cuff til smertefrihed (1-3 uger). Fri mobilisering inden for smertegrænsen. Svingeøvelser efter 1-2 dage.\nTotal luksation (type 3-5): konferer Ort Kir om evt. operativt tilbud, især hos unge (<60 år).",
        fu:"Ingen. Undgå tunge løft og kontaktsport i 3 måneder.",
      }
    },
    {n:"F. extremitas prox. humeri",icd:"DS42.2",
      tx:"Udisloceret (<1 cm, <45°): mitella/slynge 3-4 uger + smertestillende. Disloceret/4-del-fraktur/ung: ort. kir. vurdering mhp. osteosyntese/alloplastik.",
      fu:"Rtg. + KK 1-2 uger.",
      holbaek:{
        tx:"Geriatriske proksimale humerusfrakturer (>65 år): behandles konservativt som udgangspunkt, medmindre:\n- Frakturluksationer\n- Headsplit >30% af ledflade\n- Ledhoved peger helt væk fra ledskålen\n- Patient <65 år\n- Isoleret tuberculum major afsprængning >5 mm\n\nKonservativt regime: løs mitella 3 uger. Evt. 1-2 uger fikseret mitella ved mange smerter, men husk pendulsving.\n0-3 uger: ingen bevægelighed (kun pendulsving).\n3-6 uger: passiv bevægetræning, stigende til ledet aktiv.\n6-8 uger: aktiv ubelastet bevægelighed.\n8-10 uger: belastning op til max. 1 kg.\n10 uger+: langsomt progredierende belastning.\n\nVed tvivlstilfælde: kontakt ort kir vagthavende. CT + konf. ort kir mv. ved OP-indikation.",
        fu:"<65 år konservativt: 14 dages kontrol. >65 år: henvis til kommunal fys via GOP iht. regime. Udlever pjece.",
      }
    },
    {n:"F. corporis humeri",icd:"DS42.3",
      tx:"U-skinne og mitella. Udisloceret/lav energi: konservativt. Disloceret/åben/kar-nerveskade/n. radialis parese: ort. kir. vurdering.",
      fu:"Rtg. + KK 1-2 uger.",
      holbaek:{
        tx:"OBS: Holbæk kører aktuelt SHAFT projekt – disse frakturer meldes til ort kir mv.\nUdisloceret og let disloceret: fikseret mitella 7-10 dage til afhævning. Herefter Sarmientobandage i 6-8 (op til 12) uger til frakturen er klinisk fast og radiologisk i heling.\n\nOBS neurovaskulære forhold på underarm/hånd/fingre. Vurder n. radialis – ved parese: skinnebandage for at holde håndled (oftest neuropraksi).\nVed udtalt dislocering, tværfraktur eller større intermediært fragment: kontakt ort kir mhp. vurdering.",
        fu:"Kontrol i ort amb, Sarmientoanlæggelse og rtg. efter 10 dage. Klinisk og rtg. kontrol efter 4 og 8 uger, herefter månedligt til heling. Instruer i venepumpeøvelser.",
      }
    },
    {n:"Rotator cuff læsion",icd:"DM75.1",
      tx:"Slynge + NSAID. Oplagt ruptur (post-luksation, ældre): idrætsamb. (telefon dagtid). MR subakut.",
      fu:"Idrætsamb. subakut.",
      holbaek:{
        tx:"Klinisk mistanke ved: ikke abducere >90°, manglende udadrotation mod modstand, positiv drop-arm test, positiv lift-off test, positiv empty can test.\n\nBehandles med løs mitella/collar n' cuff indtil kontrol mhp. evt. operation afhængig af habituelt funktionsniveau.\nVed patienter >75 år og/eller caput oprykket tydende på gammel skade: kan henvises direkte til ADL-træning i kommunalt regi.",
        fu:"Ved mistanke: kontrol hos Ort Amb 10-14 dage. Bestil UL, der udføres inden patienten kommer i ort kir amb.",
      }
    },
  ],
  elbow:[
    {n:"F. partis distalis humeri",icd:"DS42.4",
      tx:"Bagre gipsskinne ~90° fleksion. Suprakondylær hos barn: indlæggelse (neurovaskulær status!). Voksne: ort. kir. vurdering – de fleste opereres.",
      fu:"Rtg. + KK 1 uge.",
      holbaek:{
        tx:"Udisloceret: vinkelgips i 5 uger. Rtg. efter 1, 2 og 5 uger.\nDisloceret (hyppigst): OP med skinneosteosyntese. Bestil CT mhp. operationsplanlægning.\n\nHUSK: vurdér neurovaskulære forhold!",
        fu:"Se tekst – rtg. kontrol efter 1, 2 og 5 uger.",
      }
    },
    {n:"Luxatio cubiti",icd:"DS53.1",
      tx:"Reponering (traction-countertraction, evt. let sedation). Rtg. FØR og EFTER. Bagre gipsskinne 90° i 3 uger. Neurovaskulær status før/efter.",
      fu:"Rtg. + KK 1-2 uger.",
      holbaek:{
        tx:"NVF og rtg. før og efter reponering i rus (morfin + stesolid iht. afdelingsinstruks). Kontakt evt. anæstesi.\nBørn: reponeres i GA eller lattergas.\n\nFuld reposition, ingen fraktur: vinkelgipsskinne med >90° fleksion i 2 uger + NSAID i samme periode (profylaktisk mod capsulitis ossificans).\nDelvis reposition eller fraktur: konf. ort kir mhp. operation, evt. CT.\nInstabil (terrible triad – anterior luksation + proc. coronoideus fraktur + caput/collum radii fraktur): CT + indlæggelse til operation.",
        fu:"Konservativ: kontrol ort kir amb 1 uge med rtg. Afbandagering + åben don-joy 2 uger. Afbandageres 6 uger. Ergo/fys GOP. Bevæge- og stabilitetskontrol ort amb 6-8 uger.",
      }
    },
    {n:"F. olecrani",icd:"DS52.0",
      tx:"Udisloceret (<2 mm, ekstensionsevne intakt): bagre gipsskinne 90° i 3-4 uger. Disloceret/komminut: ort. kir. vurdering mhp. osteosyntese.",
      fu:"Rtg. + KK 1-2 uger.",
      holbaek:{
        tx:"Udisloceret: vinkelgipsskinne med 45° fleksion i 4 uger. Rtg. kontrol efter gipsanlæggelse.\nDisloceret: indlæggelse/klargøring til osteosyntese med tensionband, osteosutur eller skinne.\nÆldre patienter med lavt funktionsniveau: konservativ behandling kan vælges. Konf. ort kir. Evt. ekstensionsmangel beskrives.",
        fu:"Rtg. og klinisk kontrol 10-14 dage.",
      }
    },
    {n:"F. radii, extremitas proximalis (caput radii)",icd:"DS52.1",
      tx:"Mason I (<2 mm, ingen blokering): mitella 1-2 uger + tidlig aktiv mobilisering. Mason II-III/blokering: ort. kir. vurdering mhp. osteosyntese/arthroplastik.",
      fu:"KK 1-2 uger.",
      holbaek:{
        tx:"F. capitis – udisloceret (mejselfrakturer + skæringsfrakturer med lille fragment): løs mitella evt. vinkelgipsskinne 7-10 dage.\nF. capitis – disloceret (>1/3 af ledflade disloceret >2 mm): konf. ort kir mv. Cave Essex Lopresti fraktur.\n\nF. colli – udisloceret (<30° vinkling): collar n' cuff eller vinkelgipsskinne 3 uger.\nF. colli – disloceret (>1/3 knoglebredde eller >30°): konf. ort kir mhp. reposition og evt. osteosyntese.\n\nAlle konservativt behandlede proksimale radius frakturer skal henvises til bevægetræning i kommunalt regi for at modvirke kontrakturer.",
        fu:"Klinisk bevægekontrol hos EL 10-14 dage. Henvis fys. Afbandageres hos EL.",
      }
    },
    {n:"F. antebrachium",icd:"DS52.4",
      tx:"Bagre gipsskinne. Udisloceret: konservativt + cirkulering 1 uge. Voksne disloceret/Galeazzi/Monteggia: indlæggelse til osteosyntese.",
      fu:"Rtg. + KK 1-2 uger.",
      holbaek:{
        tx:"Fraktur af ulna og radius. OBS neurovaskulære forhold.\nUdisloceret: vinkelgips 6-8 uger.\nDisloceret: indlæggelse til skinne-osteosyntese.\nOBS: compartment syndrom!\n\nMonteggia (f. corpus ulnae + luksation caput radii): anlæg høj vinkelgips + indlæg til OP.\nGaleazzi (f. corpus radii + luksation caput ulnae): anlæg høj vinkelgips + indlæg til OP.",
        fu:"Rtg. efter 10-14 dage. Afkortning efter 4 uger. Rtg. ved gipsfj. uge 6.",
      }
    },
    {n:"Bursitis olecrani",icd:"DM70.2",
      tx:"NSAID + kompressionsbandage. Aspirer ved stor burs/diagnostisk tvivl (dyrkning!). AB ved infektiøs bursit.",
      fu:"EL kontrol.",
      holbaek:{
        tx:"Oplagt irritativ bursit (lokaliseret rødme, varme, hævelse): NSAID 10 dage, aflastning med mitella, gerne immobilisering med vinkelgipsskinne.\nVed tvivl om agens (intakt hud + feber): som irritativ + antibiotika iht. lokal instruks (forudgået af bloddyrkning) + infektionstal.\nOplagt infektiøs bursit (pus, phlegmone, lymphangit, feber): konf. ort kir mv. – indikation for spaltning. Dog stor risiko for kronisk fistel.",
        fu:"Klinisk kontrol efter 10 dage hos EL. Kontrol i amb. 5-7 dage inkl. nye infektionstal ved tvivlsom.",
      }
    },
  ],
  wrist_hand:[
    {n:"F. radii, extremitas distalis (Colles/Smith/Barton)",icd:"DS52.5",
      tx:"Reponér ved dorsalvinklet >10°, radial forkortning >3 mm, volar vinkel >5°, intraartikulær skridt >2 mm. Dorsal gipsskinne neutral/let palmær vinkel. Instabil/svær kominution: ort. kir. vurdering.",
      fu:"Rtg. + KK 7-10 dage.",
      notes:"BBH: Colles (dorsal vinkling) — uacceptabel stilling: >10° dorsal vinkling, ulna-plus >2 mm, >2 mm ledspring. Reponering manuelt eller Kinastræk (max 15 min, 4-5 kg). Udisloceret: dorsal gips 4-5 uger. Disloceret acceptabel: dorsal gips 5 uger. Smith (volar vinkling): instabil → subakut amb mhp. OP. Barton/inv. Barton: subakut amb mhp. OP. Chauffeur-fraktur: ledspring >2 mm → indlæggelse til OP. Kontrol: rtg. i skadeamb 5-7, 10-14 dage og efter 5 uger.",
      holbaek:{
        tx:"Konferer med okir-MV ved tvivl. Følg lokal instruks i D4 og flowdiagram for opfølgning og acceptable grader.\n\nColles (udisloceret/ekstraartikulær): dorsal gips 4-5 uger → kontrol EL.\nLet disloceret, acceptabel – ikke reponeret: dorsal gips 5 uger → kontrol amb.\nDisloceret, uacceptabel: reponering i LA, 2 forsøg. Acceptabel herefter: dorsal gips 5 uger.\nIntraartikulær: dorsal gips 5 uger → kontrol amb inkl. rtg.\n\nSmith/Barton/Inv. Barton: oftest operation. Konferer okir-MV. Dorsal gips i skadestuen. Husk funktionsniveau.\nChauffeur fraktur: kan være associeret med scafo-luna ruptur.",
        fu:"Kontrol inkl. rtg. i skadeamb 10-12 dage og 5 uger (udisloceret: hos EL 4-5 uger).",
      }
    },
    {n:"F. os scaphoidei",icd:"DS62.0",
      tx:"Anatomical snuffbox ømhed → scaphoid gips UANSET normal rtg. Normal rtg.: MR 10-14 dage (gold standard). Proksimal pol/dislokation: ort. kir. konf. AKUT (avaskulær nekroserisiko).",
      fu:"MR + rtg. 10-14 dage. Gips til MR-svar.",
      holbaek:{
        tx:"Dårligt helingspotentiale. Tag scaphoideum specialoptagelser.\nUdisloceret: dorsal gips mindst 6 uger. Information om behandlingstid op til 12 uger.\nDisloceret: konf. ort kir mhp. osteosyntese.\nRøntgen negativ, positiv klinik: dorsal gips eller håndledsbandage indtil kontrol i amb.\n\nKlinik trepunktsøm (2 ud af 3):\n1. Kompression i tabatierren på ulnar devieret hånd.\n2. Kompression af tuberculum scaphoideii på ekstenderet håndled.\n3. Longitudinal kompression af 1. stråle.",
        fu:"Ort amb 1 uge, anlægges cirkulær gips. Yderligere ort amb 6 uger. Rtg. + KK i ort spl amb 10-20 dage.",
      }
    },
    {n:"F. os metacarpi I (Bennett/Rolando)",icd:"DS62.2",
      tx:"Bennett: reponering + scaphoid gips. Konf. ort. kir. mhp. K-tråd. Rolando (komminut): indlæggelse til osteosyntese.",
      fu:"Rtg. + KK 1 uge.",
      holbaek:{
        tx:"Skaft fraktur, udisloceret: radial kantgips 4 uger.\nSkaft fraktur, disloceret: konf. vagthavende ort kir.\nRodnær ekstraartikulær (Winterstein) <30° vinkling: radial kantgips 4 uger. >30°: konf. ort kir.\nBennett/Rolando (intraartikulær i rodled med sublux.) udisloceret: radial kantgips 4 uger. Disloceret: k-trådosteosyntese + radial kantgips 5 uger.",
        fu:"Rtg. ca. 7-10 dage og 4 uger.",
      }
    },
    {n:"F. os metacarpi II-V",icd:"DS62.3",
      tx:"Check rotation (fingre peger mod scaphoid ved fleksion). Udisloceret: dorsalbandage/volarskine 3-4 uger. Disloceret/rotation/fler-knogle: ort. kir. vurdering.",
      fu:"Rtg. + KK 10-14 dage.",
      holbaek:{
        tx:"OBS rotationsfejlstilling accepteres ikke!\nUdisloceret: dorsal gipsskinne til knoer + sambandagering af fingre 3-4 uger.\nDisloceret: reponering i LA og konf. ort kir mv. hvis vinkling ikke acceptabel eller fortsat rotationsfejlstilling.\n\nAcceptable grader (voksen subcapital vinkling):\nMeta I: 20° | Meta II-III: 10-20° | Meta IV: 30-40° | Meta V: 40-50°",
        fu:"Rtg. efter 7-10 dage.",
      }
    },
    {n:"Phalanxfrakturer (I-V)",icd:"DS62.5-6",
      tx:"Udisloceret: buddy-taping + stiv skinnebandage 3 uger. Disloceret/intraartikulær: reponering, evt. K-tråd.",
      fu:"KK 1-2 uger."},
    {n:"Dropfinger (mallet finger)",icd:"DS63.1",
      tx:"Ekstensionsskinne DIP-led i max. ekstenstion 6-8 uger dag og nat. INGEN fleksion! Avulsionsfraktur >30% ledfladen: ort. kir. vurdering.",
      fu:"KK + rtg. 6-8 uger.",
      holbaek:{
        tx:"Åben læsion: indlægges til exploration, sutur og transfixation.\nLukket læsion: Carstamskinne med leddet i strakt/hyperekstenderet stilling. Skinnefjernelse efter 6 uger. Skinnen må IKKE komme af på noget tidspunkt! Kan den holdes lige: yderligere natskinne 2 uger.\nIngen subluksation men dorsal avulsion/fraktur >30% ledflade: Carstamskinne + klinisk kontrol + rtg. 1 uge.\nSubluksation + dorsal avulsion: Carstamskinne + evt. operation. Konf. ort kir.",
        fu:"EL ved skinnefjernelse 6 uger. Ort kir amb 7-10 dage og 4-6 uger.",
      }
    },
    {n:"Ruptur ulnart collateralt ligament (ski-thumb)",icd:"DS63.6",
      tx:"Stress-test ulnar side 1. MCP. Komplet ruptur/Stener-læsion: ort. kir. vurdering til operation. Inkomplet: scaphoid gips/skinne 4-6 uger.",
      fu:"Konf. ort. kir. ved komplet ruptur.",
      holbaek:{
        tx:"Vigtig skade! Må aldrig overses! Undersøg for løshed evt. under lidocain dække.\n1. fingers grundled, ulnare coll. lig. (skitommel): kantgips og operation.\n1. fingers grundled, radiale coll. lig.: radial kantgips til IP-led 4 uger.\n2.-5. finger, grundled, udtalt løshed: operation + gips 3 uger (de fleste konservativt med sambandagering). Konf. ort MV.\nPIP-led, udtalt sideløshed (>45°): operation + gips 2 uger. Mindre: sambandagering 3 uger.",
        fu:"Kontrol i ort kir amb. Henvis til ergo.",
      }
    },
    {n:"Volarpladelæsion / luxatio articuli digiti",
      tx:"Luxation: reponering evt. med blokade. Skinnebandage i neutral stilling 2-3 uger. Volarpladelæsion: skinne 3-4 uger.",
      fu:"KK 2-3 uger."},
    {n:"Negle", tx:"Under opbygning!"}
  ],
  pelvis:[
    {n:"F. ramus superior/inferior",icd:"DS32.1",
      tx:"Isoleret ramus hos ældre: smertestillende + mobilisering til smertegrænse. Indlæggelse ved svær immobilitet. Tromboseprofylakse.",
      fu:"EL 2-4 uger.",
      holbaek:{
        tx:"Oftest trafikulykker eller ældre der falder på siden. Bækkenbrud giver ikke altid smerte.\nSmerteplan: paracetamol + morfin/oxycodon depot 10 mg × 2 + morfin/oxycodon 5 mg pn kapsel.\nHvis ikke sufficient smertedækket: indlæggelse til smertebehandling og mobilisering.\n\nVed ømhed over SI-led: akut CT-skanning – OBS ustabil bækkenfraktur!",
        fu:"EL 2-4 uger.",
      }
    },
    {n:"Ustabile bækkenfrakturer",icd:"DS32",
      tx:"AKUT LIVSTRUENDE: Bækkenslynge/bækkenbælte STRAKS. IV-adgang x2, FAST-skanning, blodprøver, Hgb. Kontakt ort. kir. + anæstesi AKUT. CT-angiografi mhp. embolisering.",
      fu:"Indlæggelse. Traumecenter.",
      holbaek:{
        tx:"Sikr ABC med intensiv EWS-score, to store venflons, IV-væske, BAC-test.\nHvis bækken er testet og mistænkes ustabilt, eller rtg. giver mistanke om open book: indlæggelse og akut CT. Anlæg bækkenslynge hvis muligt.",
        fu:"Indlæggelse. Traumecenter.",
      }
    },
    {n:"F. acetabuli",icd:"DS32.4",
      tx:"CT-skanning bækken. Kontakt ort. kir. Dislokation >2 mm intraartikulært: indlæggelse til operation.",
      fu:"Indlæggelse.",
      holbaek:{
        tx:"Udredes med akut CT. Konferer ort kir., evt. ROUH.\nOBS retroperitoneal blødning (sjælden): Sikr ABC, EWS-score, IV-adgang, tynde væsker, BAC-test, læg KAD.",
        fu:"Indlæggelse.",
      }
    },
  ],
  hip_thigh:[
    {n:"Hoftenær femurfraktur (collum/trokantær)",icd:"DS72.0-2",
      tx:"Indlæggelse STRAKS. IV-adgang, fascia-iliaca blokade (ultralyds-vejledt), smertestillende. EKG + blodprøver. Antikoagulationsbehandling: pausér/antidot. Trykforebyggelse. Operation helst inden 24 timer.",
      fu:"Indlæggelse.",
      holbaek:{
        tx:"Alle patienter med relevant traume: rtg. hofte og bækken uanset kliniske fund.\nSubtrokantære, pertrokantære og collum femoris frakturer: alle indlægges til osteosyntese.\nKontakt O-MV så snart rtg. foreligger.\n\n>65 år: CT-skanning ved positiv klinik men negativ røntgen. Fortsat negativ → smertedæk og mobilisering. Informer om at kontakte afdeling ved uforandrede/forværrede smerter efter 3 uger.\n\nVed diagnosticeret fraktur:\n- Lav AOP med fokus på funktionsniveau, medicin, komorbiditet og cave\n- Anlæg IV-adgange\n- Femoralisblok eller alternativt FIC\n- Uden blodfortyndende: kontakt anæstesi forvagt mhp. epiduralt smertekateter\n- Pausér AK-behandling, hold pt. fastende og tørstende\n- Smertedæk og overvåg\n- Tag EKG og blodprøver (væsketal, infektionstal, type, BAC, evt. levertal)\n- Urin stiks\n- Stilling til behandlingsniveau\n- Vekseltryksmadras inden sengeafdelingen",
        fu:"Indlæggelse.",
      }
    },
    {n:"Luxatio coxae (uden protese)",icd:"DS73.0",
      tx:"Akut reponering inden 6 timer (GA/dyb sedation). Rtg. FØR og EFTER. CT-skanning post-reponering mhp. intraartikulære fragmenter.",
      fu:"Indlæggelse. Krykker 6 uger.",
      holbaek:{
        tx:"Næsten altid posterior luksation.\nIndlæggelse til akut reponering i GA indenfor få timer – risiko for avaskulær nekrose!\nHusk CT for at afdække acetabulum fraktur. Undersøg klinisk for dropfod (peroneus parese).",
        fu:"Indlæggelse.",
      }
    },
    {n:"Luxatio coxae (med protese)",
      tx:"Kontakt ort. kir. AKUT. Reponering oftest i GA på OP. Rtg. FØR og EFTER.",
      fu:"Indlæggelse.",
      holbaek:{
        tx:"Indlæggelse til akut reponering indenfor få timer. I visse tilfælde reponering i skadestuen i rus.\nKonferer ALTID med ort kir eller egen bagvagt.\n\nOBS: ved fund af constrained liner på rtg. → kontakt ort kir MV. Skal IKKE forsøges reponeret!",
        fu:"Eventuel kontrol vurderes af ort kir.",
      }
    },
    {n:"F. corporis femoris",icd:"DS72.3",
      tx:"Indlæggelse til osteosyntese (oftest marvsøm). Temporær plasterstræk kan anlægges. IV-adgang + smertestillende.",
      fu:"Indlæggelse.",
      holbaek:{
        tx:"Indlæggelse til osteosyntese, oftest marvsøm. Plasterstræk ved god hud og snart op (kan ikke ligge længe). TUP-TIP stræk ved udtalt dislocering og store smerter. Ellers reponér med tæpper og støtte. Evt. gips.\nLav journal, faste, BAC, væsketal, venflon og evt. EKG. Alt efter komorbiditeter.\nKontakt ort kir mv.",
        fu:"Indlæggelse.",
      }
    },
    {n:"Coxitis / epifysiolyse (barn)",
      tx:"Drenge 5-10 år. Rtg./UL mhp. ledvæske. Indlæggelse til diagnostisk ledpunktur og antibiotika. Epifysiolyse: konferer OUH.",
      fu:"Indlæggelse.",
      holbaek:{
        tx:"Coxitis simplex: hyppigste årsag til hoftesmerter hos børn med benign prognose.\nVigtigst: udeluk septisk artrit og Calve Legg Perthe (drenge 4-8 år, periodevis halten).\n\nVed mistanke:\n1. Rtg. af begge hofteled inkl. lauensteins projektion\n2. UL-skanning af hofteled\n3. Temperatur\nVed ansamling: CRP, leukocyt + diff-tælling, ledpunktur, bloddyrkning.\nBehandling: aflastning og smertebehandling.\n\nEpifysiolyse (drenge 10-16 år, ofte overvægtige): rtg. bilat. inkl. lauenstein. Konferer ort kir.",
        fu:"I børneamb. 1 uge.",
      }
    },
  ],
  knee:[
    {n:"Distorsio genu",icd:"DS83.6",
      tx:"RICE + støttebind + håndkøbs smertestillende. Krykkestokke ved udtalt smerte.",
      fu:"EL 2-3 uger."},
    {n:"Ruptura ACL/PCL",icd:"DS83.5",
      tx:"Lachmanns test / bagre skuffetest. Rtg. (Eminentia/Segond-fraktur?). Ingen fraktur: ulåst Don-Joy + krykkestokke. Fraktur: CT + ort. kir. konf.",
      fu:"Idrætsamb. (Næstved) 2-3 uger.",
      holbaek:{
        tx:"ACL: forreste korsbånd, ofte kombineret med medialt kollateralt ligament. Lachmanns test/skuffeløshedstest.\nRtg. mhp. eminentiafraktur og Segond-fraktur.\nFraktur: CT + konf. ort kir mv.\nIngen fraktur, klinisk ACL-ruptur uden MCL-skade: ulåst Don-Joy + krykker til ort amb. Må støtte.\n\nPCL: test ved Sack sign/bagre skuffeløshed. Behandling som ved ACL.",
        fu:"Ort kir amb 2-3 uger.",
      }
    },
    {n:"F. patellae",icd:"DS82.0",
      tx:"BESKRIV ekstensionsevne og hudlæsion! Udisloceret: Don-Joy låst 0-30° i 6-8 uger. Disloceret/transversalt/komminut: indlæggelse til osteosyntese.",
      fu:"Amb. + rtg. 10-14 dage.",
      holbaek:{
        tx:"HUSK: beskriv evt. hudlæsion og strækkeevnen!\nRtg. af patella.\nUdisloceret: konservativ behandling med Don-Joy 6-8 uger. Må støtte på strakt ben initialt. Don-Joy låst 0-15° primært, oplåses gradvist i amb.\nDisloceret (tværs/komminut): indlægges til osteosyntese. Kontakt ort kir mv.\nFraktur i sagittalplan: ofte ikke operation – konf. med ort kir.",
        fu:"Amb. inkl. røntgen 10-14 dage.",
      }
    },
    {n:"F. condyli tibiae",icd:"DS82.1",
      tx:"Akut CT-skanning mhp. operation. Eminentia-fraktur: kontakt Køge. Segond-fraktur: patognomisk for ACL-læsion.",
      fu:"Akut ort. kir. vurdering.",
      holbaek:{
        tx:"Akut CT-skanning mhp. operation.\nEminentia frakturer: kontakt ort kir mv.\nAnlæg høj bagre gips og indlæg til afhævning med flowtron.\nVed samtidig luksation i knæet: kontroller puls i ADP og overvej ankel/brachial-indeks blodtryk eller CT-angiografi.\nSegond-fraktur: patognomisk for ACL-læsion.",
        fu:"Akut ort. kir. vurdering.",
      }
    },
    {n:"Luxatio patellae",icd:"DS83.0",
      tx:"Reponering (evt. morfin). Ekstendering roligt med let medialt pres. Rtg. inkl. sky-line efter reponering. Don-Joy 0-30° i 3 uger.",
      fu:"EL 3 uger. Idrætsamb. ved primær <30 år.",
      holbaek:{
        tx:"Reponeres umiddelbart, evt. med morfin. Ekstendér langsomt og forsigtigt, evt. let pres på patella i medial retning.\nHusk rtg. inkl. sky-line optagelse efter reponering mhp. evt. osteochondral læsion og fraktur.\nPrimær luksation: Don-Joy låst 0-30° i 3 uger. Fuld støtte. Henvis til fys mhp. knæstabiliserende bandage og genoptrænningsplan.\nVed avulsion/osteochondral fraktur (specielt børn): konfereres mhp. behandling – oftest med idrætskirurgisk afsnit Køge.\nRecidiverende: støttebind + krykkestokke.",
        fu:"Henvis til fys 3 uger. Udlever pjece 'når knæskallen har været ude af led'. Evt. idrætsamb. ved behov.",
      }
    },
    {n:"Ruptura traumatica menisci",icd:"DS83.2",
      tx:"Ledlinje ømhed. Aflåst knæ: konf. ort. kir. subakut artroskopi <7 dage. Ikke-aflåst: RICE + krykkestokke.",
      fu:"EL 4 uger."},
    {n:"Quadriceps/patella-sene ruptur",
      tx:"Nedsat/manglende ekstensionskraft + palpabel defekt. Kontakt ort. kir. til vurdering/operation. Strakt låst Don-Joy temporært.",
      fu:"Akut ort. kir."},
  ],
  lower_leg:[
    {n:"F. corporis tibiae",icd:"DS82.2",
      tx:"Udisloceret lukket: høj bagre gipsskinne 1-2 uger → cirkulær gips. Ustabil/åben: indlæggelse til osteosyntese. Distale ½: akut CT. OBS: compartment syndrome (pain, pallor, pulseless, paresthesia)!",
      fu:"Cirkulering 1-2 uger. Rtg. 6 uger + månedligt.",
      holbaek:{
        tx:"Tibia skaft-fraktur/crus fraktur.\nUdisloceret lukket: høj bagre gipsskinne 1-2 uger → cirkulærbandage. Osteosyntese kan overvejes hvis det ændrer mobiliseringen betydeligt.\nUstabil, lukket: indlæggelse til osteosyntese med marvsøm.\nUstabil, åben: indlæggelse til rensning, sårrevision og ekstern fiksation/osteosyntese. Gustilio-Andersson 3A: ekstern fiksation. 3B og 3C: OUH eller RH projekt (kontakt ort kir).\n\nRutinemæssigt akut CT hvis fraktur i distale ½ af tibia.\nOBS: Compartment syndrom!",
        fu:"Cirkulering 1-2 uger. Rtg. kontrol efter cirkulering og efter 6 uger og månedligt til heling.",
      }
    },
    {n:"F. corporis fibulae",icd:"DS82.4",
      tx:"Isoleret direkte traume: walker 3 uger eller ingen bandagering. Udeluk del af pronationsskade! OBS peroneusparese.",
      fu:"Ingen kontrol.",
      holbaek:{
        tx:"Isolerede fibula frakturer efter direkte traume på lateralsiden af benet.\nBehandling: walker 3 uger eller ingen bandagering.\n\nOBS: Udeluk fibulafraktur som del af pronationsskade! Test for instabilt fodled og medial ømhed. Kontakt ort kir mhp. evt. test i gennemlysning.\nOBS: peroneusparese!",
        fu:"Ingen kontrol.",
      }
    },
    {n:"Læsio traumatica tendina achilles",icd:"DS86.0",
      tx:"Positiv Thompsons test + palpabel defekt. Konservativt FØRSTEVALG: walker + 4 kiler. Fysioterapi start 2 uger (kilereduktion). ALTID spidsfodsstilling ved af-/påtagning. Total behandlingstid ≥8 uger.",
      fu:"Fysioterapi 2 uger. Amb. kontrol.",
      holbaek:{
        tx:"Mistanke ved anamnese (evt. hørbart smæld), positiv Thompsons test og evt. Matles test, palpabel defekt. UL i akutafdelingen kan hjælpe.\n\nFørstevalg: konservativ behandling med walker og 3 kiler (obs: aircast walker, den grå).\nKirurgisk behandling: muligt ved helt distale rupturer og sportsudøvere på højt plan. Informer om risici.\n\nVed konservativ behandling:\nPatienten fjerner selv gradvist kiler iht. regime.\nIngen støtte de første 4 uger.\nHenvisning til Fysio- og Ergoterapiafd. Holbæk Sygehus – telefonisk kontakt førstkommende hverdag.\nForventet afbandagering hos fysioterapeut efter 8 uger.\nHvis fjernelse af støvle i eget hjem: ALTID holde foden i spidsfod.\nSamlet behandlingstid mindst 8 uger.\nOvervej tromboseprofylakse ved risikofaktorer.\nUdlever pjece: 'Overrevet Akillessene – konservativt behandlet'.",
        fu:"Henvis til fys i deres forløb ved konservativ behandling. Udlever pjece.",
      }
    },
  ],
  ankle:[
    {n:"F. malleoli",icd:"DS82.6",
      tx:"Klassificér efter Lauge Hansen. Oplagte fejlstillinger: grovreponering i morfin + gipsskinne FØR rtg. Konservativ (SA1/SU2 <2 mm, ingen medial ømhed): air-cast/walker, fuld støtte 6 uger. Øvrige: klargøring til OP. Åben fraktur: IV AB + Te-booster straks.",
      fu:"Rtg. 7-10 dage.",
      holbaek:{
        tx:"Klassificeres efter Lauge Hansen Klassifikation.\n\nOplagte fejlstillinger: Reponeres og bandageres med gipsskinne INDEN røntgen. Sigte mod at 2. tå og knæskallen står på samme vertikale linje. Rtg. efter reponering for at dokumentere. Max 2 reponeringsforsøg – herefter kontakt ort kir mellemvagt.\nAcceptabel stilling: tibia plafonden centreret over talus i side og AP-plan.\n\nKonservativ behandling:\n1. Isoleret lateral malleol fraktur, minimalt displaceret medial malleol eller isoleret bagkantsfraktur uden gab (SU2/SA1/PA1/PU1): walker/air-cast, fuld støtte + kontrol ort amb 7-10 dage med stående belastet rtg.\n2. Mistanke om syndesmoseruptur (proksimal fibulafraktur, ingen medial fraktur – Maisonneuve): stående belastningsrtg.\n3. Kontraindikationer til operation (neuropati, venøs insufficiens, compliance): reponer + ambulant follow-up.\n\nØvrige patienter klargøres til OP. IV-fragmin, afhævning med flowtron, faste.",
        fu:"Ort kir amb 7-10 dage med stående belastningsrtg.",
      }
    },
    {n:"Distorsio regionis malleoli",icd:"DS93.4",
      tx:"Ottawa Ankle Rules. Grad 1 (støtter umiddelbart): RICE. Grad 2 (udtalt halten): RICE + smertestillende. Grad 3 (ingen støtte): RICE + krykkestokke + aircast. OBS: achilles, tib. post., peroneus, talus!",
      fu:"Ingen (grad 1) / EL 2 uger (grad 2-3)."},
    {n:"F. tibia distalis (pilon)",icd:"DS82.3",
      tx:"Udisloceret ekstraarticulær: konf. ort. kir. Disloceret ekstraarticulær: indlæggelse + osteosyntese. Intraarticulær: indlæggelse + CT + temporær ekstern fiksation 7-10 dage inden definitiv OP.",
      fu:"Rtg. + amb. 7-10 dage.",
      holbaek:{
        tx:"Udisloceret: konf. mhp. evt. konservativ behandling.\nDisloceret tilsyneladende ekstraartikulær: indlægges til osteosyntese, elevation og flowtron. Bestil CT.\nDisloceret intraartikulær (Pilon): indlægges, elevation, flowtron, oftest forudgået af temporær ekstern fiksation 7-10 dage. Bestil CT.",
        fu:"Kontrol + rtg. i amb. 7-10 dage.",
      }
    },
    {n:"Epifysiolyse distale fibula/tibia (barn)",
      tx:"Udisloceret: bagre gipsskinne 1-2 uger. Disloceret: indlæggelse til reposition og evt. fiksation. Tillaux/Triplan-fraktur: CT + ort. kir.",
      fu:"Rtg. 1 og 4 uger."},
  ],
  foot:[
    {n:"F. tali",icd:"DS92.1",
      tx:"CT-skanning (alle). Udisloceret: walker 8 uger, ingen støtte 6-8 uger. Disloceret: konf. OUH.",
      fu:"Rtg. amb. 2 og 6 uger.",
      holbaek:{
        tx:"Udredes med CT-skanning.\nBehandling af collum og corpus tali frakturer er samlet på Køge Sygehus – kontakt tidligt.\nDisplacerede frakturer, særligt collum: kontakt Køge akut, også i vagten.\nUdisloceret: kontakt Køge dagen efter i dagtid.\n\nUdisloceret (Hawkins 1, lateral og posterior proces samt corpus tali): walker 8 uger, ingen støtte 6-8 uger.\nDisloceret: CT + konf. Køge, indlæg til elevation og afhævning.\nVigt. at vurdere for osteokondral skade – ved mistanke på rtg.: CT eller MR. Ingen støtte 6 uger ved osteokondral skade.",
        fu:"Rtg. kontrol i amb. 2 og 6 uger.",
      }
    },
    {n:"F. calcani",icd:"DS92.0",
      tx:"Mål Bøhler-vinklen (normal 20-40°). Udisloceret: ingen bandage, elevation, ubelastede bevægeøvelser, ingen støtte 6 uger. Disloceret: CT + konf. OUH mhp. OP.",
      fu:"Rtg. amb. 2 uger.",
      holbaek:{
        tx:"Højenergi traumer, fx fald fra stor højde. Udmål Bøhlervinklen.\n\nUdisloceret: ingen bandage nødvendig – instruér i elevation og ubelastede bevægeøvelser. Aftagelig fod/ankel ortose kan overvejes. Kompressionsbind som ødemprofylakse. Ingen støtte 8-10 uger.\n\nDisloceret: CT + konf. Køge mhp. OP. Endelig beslutning om operativ behandling hos Køge Sygehus (højt specialiseret).\n\n'Andenæbs' frakturer: akut operationsindikation pga. risiko for hudnekrose ved achillessene-tilhæftning. Bør opereres inden 6 timer – kan ske på lokalsygehus uden Køge-konference. Kontakt ort kir mv.",
        fu:"Kontrol i amb. inkl. rtg. 2 og 8 uger.",
      }
    },
    {n:"F. metatarsi I",icd:"DS92.3",
      tx:"Udisloceret: walker 4 uger. Disloceret: konf. Køge mhp. OP.",
      fu:"Rtg. + KK 4 uger.",
      holbaek:{
        tx:"1. metatars udisloceret (sjælden fraktur): præfabrikeret stivbundet sandal eller walker. 3 uger uden støtte, 3 uger med støtte. Må tages af ved bad.\n1. metatars disloceret (ofte del af større skade/LisFranc): konf. ort kir.",
        fu:"KK og stående belastningsrtg. 10-14 dage og 6-8 uger.",
      }
    },
    {n:"F. metatarsi II-IV",icd:"DS92.3",
      tx:"Udisloceret: walker 2-3 uger + daglige vippeøvelser u. støvle. Disloceret: konf. Køge om OP, ellers walker + kontrol 14 dage.",
      fu:"Rtg. + KK 4 uger.",
      holbaek:{
        tx:"2.-4. metatars udisloceret: præfabrikeret stivbundet sandal eller walker 4 uger. Belastning til smertegrænse. 3 × dagligt ubelastede vippeøvelser uden støvle.\n2.-4. metatars disloceret: konf. ort kir om evt. operation. Operativ indikation ved >30° vinkling i sideplan eller corpusfrakturer >10° i sideplan / >4 mm displacering / multiple dislocerede.",
        fu:"KK og stående belastningsrtg. 10-14 dage og 6-8 uger.",
      }
    },
    {n:"F. metatarsi V (Jones/tuberositas/midtskaft)",icd:"DS92.3",
      tx:"Tuberositas avulsion <2 mm: walker + krykkestokke 4 uger. Jones-fraktur/midtskaft: walker 6 uger (kun skyggestøtte 4 uger) – dårlig heling, pseudoartrose-risiko! Disloceret: konf. Køge.",
      fu:"Rtg. + KK 6 uger.",
      holbaek:{
        tx:"Konservativ behandling (alle frakturer <30° vinkling i sideplan): præfabrikeret stivbundet sandal eller walker 4 uger med støtte. Kan fjernes om natten.\n\nJones-fraktur og midtskaftsfraktur (proksimale 1/3 af diafysen): dårligt helingspotentiale, tendens til pseudoartrose.\nUdisloceret: walker 6 uger, kun skyggestøtte de første 4 uger.\nDisloceret: konf. ort kir – tages op med fodsektion dagen efter.\n\nAlle frakturer i distale ½ behandles som metatarsi II-IV.",
        fu:"Udisloceret: ingen kontrol, afsluttes til EL. Jones/midtskaft disloceret konservativt: KK + rtg. 2 og 6 uger.",
      }
    },
    {n:"F. digiti pedis",icd:"DS92.4-5",
      tx:"1. tå udisloceret: plasterspica + stivbundet fodtøj 3-4 uger. 1. tå disloceret: reponering + konf. Køge mhp. K-tråd. Øvrige tæer: buddy-taping/harlowwood + stivbundet fodtøj 5-6 uger.",
      fu:"Ingen rutinekontrol.",
      holbaek:{
        tx:"1. tå udisloceret: plasterspica/harlowwood + præfabrikeret stivbundet sandal eller walker 3-4 uger. Fuld belastning.\n1. tå disloceret/intraartikulær >25%: reponering + konf. ort kir mhp. evt. K-trådsfiksation (tages op med fodteam).\n\nØvrige tæer: kun rtg. ved grov fejlstilling. Evt. reponering. Plasterspica/harlowwood eller sammentapning til nabotå + stivbundet fodtøj 5-6 uger. Plasterskift hos EL.",
        fu:"Ingen kontrol for simple frakturer. Displacerede/intraartikulære >25% ledflade: kontrol ort kir amb + rtg. 7-10 dage.",
      }
    },
    {n:"Frakturluksationer midtfod (LisFranc/Chopart)",
      tx:"Belastningssmerte i mellemfod. Rtg. stående (bilateral). CT AKUT + konf. Køge.",
      fu:"Akut ort. kir.",
      holbaek:{
        tx:"Hyppigst i:\nSubtalart led: fejlstilling i anklen, tolkes ofte som disloceret ankelfraktur. Rtg. før og efter grovreponering. CT + konf. Køge fodsektion.\nChoparts led: CT + konf. Køge fodsektion.\nLisFrancs led: CT + evt. konf. Køge fodsektion.\n\nUdisloceret: konservativ behandling uden belastning 6 uger. Kontrol amb + ubelastet rtg. 10-14 dage og stående belastningsrtg. 6 uger. Ingen 'fleck sign' → svangstøtte 6 uger.\nDisloceret/'Fleck sign': konf. Køge fodsektion.\n\nDe fleste kræver indlæggelse til smertestillende og afhævning. Alle skal have akut CT.",
        fu:"Udisloceret: amb. kontrol med ubelastet rtg. 10-14 dage + stående belastningsrtg. 6 uger.",
      }
    },
  ],
};

function BodySVG({ sel, hov, onSel, onHov }) {
  return (
    <svg viewBox="0 0 240 610" style={{width:"100%",maxWidth:200,display:"block",cursor:"default"}}>
      {ORDER.map(id =>
        SHAPES[id].map((s, i) => {
          const active = id === sel || id === hov;
          const dimmed = (sel || hov) && !active;
          const props = {
            key:`${id}-${i}`,
            fill: COLORS[id],
            fillOpacity: active ? 0.85 : dimmed ? 0.08 : 0.28,
            stroke: COLORS[id],
            strokeWidth: active ? 2 : 0.5,
            strokeOpacity: active ? 1 : 0.35,
            onClick: () => onSel(id === sel ? null : id),
            onMouseEnter: () => onHov(id),
            onMouseLeave: () => onHov(null),
            style:{cursor:"pointer",transition:"fill-opacity 0.12s, stroke-opacity 0.12s"},
          };
          return s.t === "e"
            ? <ellipse {...props} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
            : <polygon {...props} points={s.d} />;
        })
      )}
    </svg>
  );
}

function DxCard({ dx, color, open, onToggle, hospital }) {
  const h = dx.holbaek;
  const isOverridden = hospital === "holbaek" && h;
  const tx   = isOverridden && h.tx   ? h.tx   : dx.tx;
  const fu   = isOverridden && h.fu   ? h.fu   : dx.fu;
  const notes = isOverridden && h.notes ? h.notes : dx.notes;

  return (
    <div style={{
      border:`0.5px solid ${open ? color+"66" : "var(--color-border-tertiary)"}`,
      borderRadius:"var(--border-radius-md)",
      overflow:"hidden",
      background: open ? color+"08" : "var(--color-background-primary)",
      transition:"border-color 0.15s, background 0.15s",
    }}>
      <div
        onClick={onToggle}
        style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"12px 16px", cursor:"pointer", gap:12,
        }}
      >
        <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
          {dx.icd && (
            <span style={{
              flexShrink:0,
              fontSize:11, fontWeight:500,
              color: color,
              background: color+"18",
              padding:"1px 7px",
              borderRadius:3,
              letterSpacing:"0.03em",
            }}>
              {dx.icd}
            </span>
          )}
          <span style={{
            fontSize:13, fontWeight:500,
            color:"var(--color-text-primary)",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          }}>
            {dx.n}
          </span>
          {isOverridden && (
            <span style={{
              flexShrink:0,
              fontSize:9, fontWeight:600,
              color:"#fff",
              background: color,
              padding:"1px 5px",
              borderRadius:2,
              letterSpacing:"0.05em",
              opacity:0.85,
            }}>HBK</span>
          )}
        </div>
        <span style={{
          flexShrink:0, fontSize:16, lineHeight:1,
          color: open ? color : "var(--color-text-tertiary)",
          transform: open ? "rotate(45deg)" : "none",
          transition:"transform 0.2s, color 0.15s",
        }}>+</span>
      </div>
      {open && (
        <div style={{padding:"0 16px 14px"}}>
          <div style={{height:"0.5px", background:color+"30", marginBottom:12}} />
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:5}}>
              Behandling
            </div>
            <div style={{fontSize:13,lineHeight:1.7,color:"var(--color-text-secondary)", whiteSpace:"pre-line"}}>
              {tx}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:5}}>
              Opfølgning
            </div>
            <div style={{fontSize:13,lineHeight:1.6,color:color,fontWeight:500, whiteSpace:"pre-line"}}>
              {fu}
            </div>
          </div>
          {notes && (
            <div style={{marginTop:10}}>
              <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:5}}>
                Noter
              </div>
              <div style={{fontSize:13,lineHeight:1.7,color:"var(--color-text-secondary)", whiteSpace:"pre-line"}}>
                {notes}
              </div>
            </div>
          )}
          {dx.img && (
            <img src={dx.img} alt={dx.n} style={{marginTop:12,width:"100%",borderRadius:6,border:"0.5px solid var(--color-border-tertiary)"}} />
          )}
        </div>
      )}
    </div>
  );
}

const HOSPITALS = [
  {id:"slagelse", label:"Slagelse"},
  {id:"holbaek",  label:"Holbæk"},
];

export default function App() {
  const [sel, setSel] = useState(null);
  const [hov, setHov] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);
  const [hospital, setHospital] = useState("slagelse");

  const handleSel = (id) => { setSel(id); setOpenIdx(null); };
  const color = sel ? COLORS[sel] : "#378ADD";
  const label = sel ? LABELS[sel] : null;
  const hovLabel = hov ? LABELS[hov] : null;
  const dxList = sel ? DATA[sel] : null;
  const hospitalLabel = HOSPITALS.find(h => h.id === hospital)?.label;

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"var(--font-sans)",overflow:"hidden"}}>
      <div style={{
        width:256, minWidth:256,
        background:"var(--color-background-secondary)",
        borderRight:"0.5px solid var(--color-border-tertiary)",
        display:"flex", flexDirection:"column", alignItems:"center",
        padding:"20px 14px",
        overflowY:"auto",
      }}>
        <div style={{textAlign:"center", marginBottom:10, width:"100%"}}>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",letterSpacing:"0.04em"}}>
            Skadestueinstruks
          </div>
          <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:2}}>
            Region Sjælland
          </div>
        </div>

        {/* Hospital selector */}
        <div style={{display:"flex",gap:4,marginBottom:12,width:"100%"}}>
          {HOSPITALS.map(h => (
            <button
              key={h.id}
              onClick={() => { setHospital(h.id); setOpenIdx(null); }}
              style={{
                flex:1,
                padding:"5px 0",
                fontSize:11,
                fontWeight: hospital === h.id ? 600 : 400,
                borderRadius:4,
                border:`1px solid ${hospital === h.id ? color : "var(--color-border-tertiary)"}`,
                background: hospital === h.id ? color+"18" : "transparent",
                color: hospital === h.id ? color : "var(--color-text-secondary)",
                cursor:"pointer",
                fontFamily:"inherit",
                transition:"all 0.15s",
              }}
            >
              {h.label}
            </button>
          ))}
        </div>

        <div style={{height:26,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}>
          <div style={{
            padding:"3px 10px", borderRadius:3,
            fontSize:11, fontWeight:500,
            background: (hovLabel && !sel) ? "var(--color-background-tertiary)" : color+"15",
            border:`0.5px solid ${(hovLabel && !sel) ? "var(--color-border-tertiary)" : color+"40"}`,
            color: (hovLabel && !sel) ? "var(--color-text-secondary)" : color,
            maxWidth:"100%", textAlign:"center",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            opacity: (hovLabel || label) ? 1 : 0,
          }}>
            {hovLabel || label || "placeholder"}
          </div>
        </div>

        <BodySVG sel={sel} hov={hov} onSel={handleSel} onHov={setHov} />

        <div style={{marginTop:14,width:"100%"}}>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",marginBottom:8,textAlign:"center"}}>
            Eller vælg direkte
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center"}}>
            {Object.entries(LABELS).map(([id, lbl]) => (
              <button
                key={id}
                onClick={() => handleSel(id === sel ? null : id)}
                style={{
                  padding:"2px 8px",
                  fontSize:10,
                  borderRadius:3,
                  border:`0.5px solid ${id === sel ? COLORS[id]+"80" : "var(--color-border-tertiary)"}`,
                  background: id === sel ? COLORS[id]+"12" : "transparent",
                  color: id === sel ? COLORS[id] : "var(--color-text-tertiary)",
                  cursor:"pointer",
                  fontFamily:"inherit",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
        {!sel ? (
          <div style={{maxWidth:540,margin:"60px auto",textAlign:"center"}}>
            <svg width="40" height="40" viewBox="0 0 40 40" style={{marginBottom:16}}>
              <ellipse cx="20" cy="20" rx="16" ry="16" fill="#378ADD" fillOpacity="0.15" stroke="#378ADD" strokeWidth="1"/>
              <ellipse cx="20" cy="14" rx="4" ry="5" fill="#378ADD" fillOpacity="0.6"/>
              <path d="M13,22 Q13,36 20,36 Q27,36 27,22" fill="#378ADD" fillOpacity="0.5"/>
            </svg>
            <h2 style={{fontSize:22,fontWeight:500,color:"var(--color-text-primary)",marginBottom:10}}>
              Vælg en kropsdel
            </h2>
            <p style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:24}}>
              Klik på et område i kropsdiagrammet til venstre, eller brug genvejsknapperne, for at se behandlingsinstrukser for <strong>{hospitalLabel}</strong>.
            </p>
            <div style={{
              background:"var(--color-background-secondary)",
              border:"0.5px solid var(--color-border-tertiary)",
              borderRadius:"var(--border-radius-lg)",
              padding:"16px 20px", textAlign:"left",
            }}>
              <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:10}}>
                Fokusområder
              </div>
              {[
                "Test ulnare collaterale ligament på 1. finger – se håndafsnit",
                "Scaphoideum ømhed – anatomical snuffbox test",
                "Rygfrakturer og CT-skanninger",
                "Knæ med ekstensionsdefekt >10° – kontrol i amb. 1 uge",
                "Hofter der ikke er oplagte frakturer – F. coxae",
              ].map((tip, i) => (
                <div key={i} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:"var(--color-text-tertiary)",marginTop:7,flexShrink:0}} />
                  <span style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.6}}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{maxWidth:640}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{
                    display:"inline-block",
                    fontSize:10, fontWeight:500, letterSpacing:"0.08em",
                    textTransform:"uppercase",
                    background: color+"18",
                    color: color,
                    padding:"2px 9px", borderRadius:3,
                  }}>
                    Behandling
                  </div>
                  <div style={{
                    display:"inline-block",
                    fontSize:10, fontWeight:600, letterSpacing:"0.06em",
                    textTransform:"uppercase",
                    background:"var(--color-background-tertiary)",
                    color:"var(--color-text-secondary)",
                    padding:"2px 9px", borderRadius:3,
                    border:"0.5px solid var(--color-border-secondary)",
                  }}>
                    {hospitalLabel}
                  </div>
                </div>
                <h2 style={{fontSize:22,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.3}}>
                  {label}
                </h2>
                <div style={{marginTop:6,height:2,background:color,width:40,borderRadius:1,opacity:0.5}} />
              </div>
              <button
                onClick={() => handleSel(null)}
                style={{
                  padding:"5px 12px", fontSize:12,
                  border:"0.5px solid var(--color-border-secondary)",
                  borderRadius:"var(--border-radius-md)",
                  background:"transparent",
                  color:"var(--color-text-secondary)",
                  cursor:"pointer", fontFamily:"inherit",
                }}
              >
                ← Tilbage
              </button>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {dxList.map((dx, i) => (
                <DxCard
                  key={i}
                  dx={dx}
                  color={color}
                  open={openIdx === i}
                  onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  hospital={hospital}
                />
              ))}
            </div>

            <div style={{
              marginTop:24,
              padding:"12px 16px",
              borderRadius:"var(--border-radius-md)",
              background:"var(--color-background-secondary)",
              border:"0.5px solid var(--color-border-tertiary)",
              fontSize:12,
              color:"var(--color-text-tertiary)",
              lineHeight:1.6,
            }}>
              <strong style={{color:"var(--color-text-secondary)"}}>Forkortelser:</strong>{" "}
              EL = Egen læge · KK = Klinisk kontrol · Rtg = Røntgen · Amb = Ambulatorium · OUH = Odense Universitetshospital · OP = Operation · HBK = Holbæk-specifik instruks
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
