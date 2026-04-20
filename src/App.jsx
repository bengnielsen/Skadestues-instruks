import { useState } from "react";

const COLORS = {
  head:"#378ADD", cervical:"#1D9E75", thorax:"#D85A30", spine:"#BA7517",
  shoulder:"#7F77DD", elbow:"#85B7EB", wrist_hand:"#D4537E", pelvis:"#993C1D",
  hip_thigh:"#5DCAA5", knee:"#EF9F27", lower_leg:"#534AB7", ankle:"#1D9E75", foot:"#ED93B1"
};
const LABELS = {
  head:"Hoved, ansigt & øjne", cervical:"Columna cervicalis", thorax:"Thorax",
  spine:"Columna thoracalis & lumbalis", shoulder:"Skulder & overarm",
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

const DATA = {
  head:[
    {n:"Hovedtraume",icd:"DS09.9",tx:"Indlæggelse ved GCS ≤14, fokal neurologi, bevidsthedstab, amnesi, opkastning, mistanke om penetrerende skade, eller alder <2 år. CT-skanning ved indikation. Rtg. columna cervicalis ved nakkesmerter.",fu:"Observation 2-4 timer. Udskrives ved GCS 15 og asymptomatisk."},
    {n:"F. nasi",icd:"DS02.2",tx:"Rtg. kun ved mistanke om anden fraktur. Behandles ikke akut. Iskompres og smertestillende.",fu:"Kontrol ØNH 7-10 dage mhp. evt. reponering."},
    {n:"Epistaxis",icd:"DR040",tx:"Kompression 10-15 min. Merocel-tampon med NaCl. AB under pakke (Phenoxymetylpenicillin). Bagre epistaxis: kontakt ØNH.",fu:"Fjernelse af pakke efter 2-3 dage."},
    {n:"Øjenskader",tx:"Svejseøjne/abrasio cornea: bedøvende dråber + NSAID-dråber + mørke + kloramfenikol øjensalve. Syre/base ætsning: SKYL MINDST 1 TIME. Akut øjenlæge.",fu:"Akut øjenlæge ved ætsning eller gennemtrængende skade."},
    {n:"F. mandibulae / maxillae",icd:"DS02.6",tx:"Rtg. (OPG, Waters). Kæbekirurg vurdering. Behandles oftest operativt.",fu:"Kæbekirurg akut/subakut."},
    {n:"Haematoma auris",icd:"DH61",tx:"Punktur og kompressionsbandasje. Undgå blodansamling mhp. brusk destruktion.",fu:"ØNH kontrol 24-48 timer."},
  ],
  cervical:[
    {n:"Distorsio columnae cervicalis (piskesmæld)",icd:"DS13.4",tx:"Ingen immobilisering. Aktiv tidlig mobilisering. NSAID og paracetamol. Evt. kortvarig blød halskrave max 3-5 dage. Fysioterapi. Ingen rutinemæssig rtg.",fu:"EL ved vedvarende gener."},
    {n:"F. columnae cervicalis",icd:"DS12",tx:"AKUT: Stiv Philadelphia halskrave straks. Rygimmobilisation. CT-skanning columna cervicalis. MR ved neurologisk deficit. Kontakt rygvagt akut. Indlæggelse.",fu:"Indlæggelse. Rygvagt vurderer."},
  ],
  thorax:[
    {n:"F. costae",icd:"DS22.3",tx:"1-2 ribben, upåvirket: NSAID + paracetamol, ingen bandagering. Rtg. thorax ved mistanke om pneumothorax/hæmothorax. Indlæggelse ved ≥3 frakturer, ældre/KOL/dyspnø, eller pneumo/hæmothorax.",fu:"Ingen rutinemæssig kontrol ved 1-2 ribben."},
    {n:"F. sternum",icd:"DS22.2",tx:"Lateral rtg. + EKG. Udisloceret, normal EKG: smertestillende, ingen bandagering. Disloceret eller EKG-forandringer/forhøjet troponin: indlæggelse til observation.",fu:"EL kontrol."},
  ],
  spine:[
    {n:"F. columnae thoracalis/lumbalis",icd:"DS22.0/DS32",tx:"CT-skanning af frakturregion. Stabil (anterior kompressionsfraktur <50%, ingen neuro): smertestillende, mobilisering, evt. korset. Ustabil/neurologisk: immobilisation + rygvagt AKUT.",fu:"Rygamb. 6 uger."},
    {n:"Akut diskusprolaps",icd:"DM51.1",tx:"Smertebehandling + aktiv mobilisering. MR ved neurologiske udfald. Cauda equina (blære/tarm-parese, sadelbedøvelse): akut MR + akut rygkir./neurolog.",fu:"EL. Henvisning ved manglende bedring 4-6 uger."},
  ],
  shoulder:[
    {n:"F. claviculae",icd:"DS02.0",tx:"Midterste 2/3, udisloceret/moderat: slynge 3-6 uger + smertestillende. Meget disloceret, hudtrussel, åben, kar-/nerveskade: ort. kir. vurdering.",fu:"Rtg. + KK 6 uger."},
    {n:"Lux. art. humeroscapularis",icd:"DS43.0",tx:"Reponering (Cunningham/Kocher/Milch). Rtg. FØR og EFTER. Slynge 3 uger. Primær luksation <30 år: idrætsamb. Recidivluksation <40 år med OP-ønske: idrætsamb.",fu:"Primær <30 år → idrætsamb. Øvrige → EL."},
    {n:"Lux. art. acromioclavicularis",icd:"DS43.1",tx:"Grad 1-2: slynge 2-3 uger + smertestillende. Grad 3 (komplet): slynge 3-6 uger, ort. kir. vurdering ved OP-ønske.",fu:"Ort. amb. ved manglende bedring."},
    {n:"F. extremitas prox. humeri",icd:"DS42.2",tx:"Udisloceret (<1 cm, <45°): mitella/slynge 3-4 uger + smertestillende. Disloceret/4-del-fraktur/ung: ort. kir. vurdering mhp. osteosyntese/alloplastik.",fu:"Rtg. + KK 1-2 uger."},
    {n:"F. corporis humeri",icd:"DS42.3",tx:"U-skinne og mitella. Udisloceret/lav energi: konservativt. Disloceret/åben/kar-nerveskade/n. radialis parese: ort. kir. vurdering.",fu:"Rtg. + KK 1-2 uger."},
    {n:"Rotator cuff læsion",icd:"DM75.1",tx:"Slynge + NSAID. Oplagt ruptur (post-luksation, ældre): idrætsamb. (telefon dagtid). MR subakut.",fu:"Idrætsamb. subakut."},
  ],
  elbow:[
    {n:"F. partis distalis humeri",icd:"DS42.4",tx:"Bagre gipsskinne ~90° fleksion. Suprakondylær hos barn: indlæggelse (neurovaskulær status!). Voksne: ort. kir. vurdering – de fleste opereres.",fu:"Rtg. + KK 1 uge."},
    {n:"Luxatio cubiti",icd:"DS53.1",tx:"Reponering (traction-countertraction, evt. let sedation). Rtg. FØR og EFTER. Bagre gipsskinne 90° i 3 uger. Neurovaskulær status før/efter.",fu:"Rtg. + KK 1-2 uger."},
    {n:"F. olecrani",icd:"DS52.0",tx:"Udisloceret (<2 mm, ekstensionsevne intakt): bagre gipsskinne 90° i 3-4 uger. Disloceret/komminut: ort. kir. vurdering mhp. osteosyntese.",fu:"Rtg. + KK 1-2 uger."},
    {n:"F. radii, extremitas proximalis (caput radii)",icd:"DS52.1",tx:"Mason I (<2 mm, ingen blokering): mitella 1-2 uger + tidlig aktiv mobilisering. Mason II-III/blokering: ort. kir. vurdering mhp. osteosyntese/arthroplastik.",fu:"KK 1-2 uger."},
    {n:"F. antebrachium",icd:"DS52.4",tx:"Bagre gipsskinne. Udisloceret: konservativt + cirkulering 1 uge. Voksne disloceret/Galeazzi/Monteggia: indlæggelse til osteosyntese.",fu:"Rtg. + KK 1-2 uger."},
    {n:"Bursitis olecrani",icd:"DM70.2",tx:"NSAID + kompressionsbandage. Aspirer ved stor burs/diagnostisk tvivl (dyrkning!). AB ved infektiøs bursit.",fu:"EL kontrol."},
  ],
  wrist_hand:[
    {n:"F. radii, extremitas distalis (Colles/Smith/Barton)",icd:"DS52.5",tx:"Reponér ved dorsalvinklet >10°, radial forkortning >3 mm, volar vinkel >5°, intraartikulær skridt >2 mm. Dorsal gipsskinne neutral/let palmær vinkel. Instabil/svær kominution: ort. kir. vurdering.",fu:"Rtg. + KK 7-10 dage."},
    {n:"F. os scaphoidei",icd:"DS62.0",tx:"Anatomical snuffbox ømhed → scaphoid gips UANSET normal rtg. Normal rtg.: MR 10-14 dage (gold standard). Proksimal pol/dislokation: ort. kir. konf. AKUT (avaskulær nekroserisiko).",fu:"MR + rtg. 10-14 dage. Gips til MR-svar."},
    {n:"F. os metacarpi I (Bennett/Rolando)",icd:"DS62.2",tx:"Bennett: reponering + scaphoid gips. Konf. ort. kir. mhp. K-tråd. Rolando (komminut): indlæggelse til osteosyntese.",fu:"Rtg. + KK 1 uge."},
    {n:"F. os metacarpi II-V",icd:"DS62.3",tx:"Check rotation (fingre peger mod scaphoid ved fleksion). Udisloceret: dorsalbandage/volarskine 3-4 uger. Disloceret/rotation/fler-knogle: ort. kir. vurdering.",fu:"Rtg. + KK 10-14 dage."},
    {n:"Phalanxfrakturer (I-V)",icd:"DS62.5-6",tx:"Udisloceret: buddy-taping + stiv skinnebandage 3 uger. Disloceret/intraartikulær: reponering, evt. K-tråd.",fu:"KK 1-2 uger."},
    {n:"Dropfinger (mallet finger)",icd:"DS63.1",tx:"Ekstensionsskinne DIP-led i max. ekstenation 6-8 uger dag og nat. INGEN fleksion! Avulsionsfraktur >30% ledfladen: ort. kir. vurdering.",fu:"KK + rtg. 6-8 uger."},
    {n:"Ruptur ulnart collateralt ligament (ski-thumb)",icd:"DS63.6",tx:"Stress-test ulnar side 1. MCP. Komplet ruptur/Stener-læsion: ort. kir. vurdering til operation. Inkomplet: scaphoid gips/skinne 4-6 uger.",fu:"Konf. ort. kir. ved komplet ruptur."},
    {n:"Volarpladelæsion / luxatio articuli digiti",tx:"Luxation: reponering evt. med blokade. Skinnebandage i neutral stilling 2-3 uger. Volarpladelæsion: skinne 3-4 uger.",fu:"KK 2-3 uger."},
  ],
  pelvis:[
    {n:"F. ramus superior/inferior",icd:"DS32.1",tx:"Isoleret ramus hos ældre: smertestillende + mobilisering til smertegrænse. Indlæggelse ved svær immobilitet. Tromboseprofylakse.",fu:"EL 2-4 uger."},
    {n:"Ustabile bækkenfrakturer",icd:"DS32",tx:"AKUT LIVSTRUENDE: Bækkenslynge/bækkenbælte STRAKS. IV-adgang x2, FAST-skanning, blodprøver, Hgb. Kontakt ort. kir. + anæstesi AKUT. CT-angiografi mhp. embolisering.",fu:"Indlæggelse. Traumecenter."},
    {n:"F. acetabuli",icd:"DS32.4",tx:"CT-skanning bækken. Kontakt ort. kir. Dislokation >2 mm intraartikulært: indlæggelse til operation.",fu:"Indlæggelse."},
  ],
  hip_thigh:[
    {n:"Hoftenær femurfraktur (collum/trokantær)",icd:"DS72.0-2",tx:"Indlæggelse STRAKS. IV-adgang, fascia-iliaca blokade (ultralyds-vejledt), smertestillende. EKG + blodprøver. Antikoagulationsbehandling: pausér/antidot. Trykforebyggelse. Operation helst inden 24 timer.",fu:"Indlæggelse."},
    {n:"Luxatio coxae (uden protese)",icd:"DS73.0",tx:"Akut reponering inden 6 timer (GA/dyb sedation). Rtg. FØR og EFTER. CT-skanning post-reponering mhp. intraartikulære fragmenter.",fu:"Indlæggelse. Krykker 6 uger."},
    {n:"Luxatio coxae (med protese)",tx:"Kontakt ort. kir. AKUT. Reponering oftest i GA på OP. Rtg. FØR og EFTER.",fu:"Indlæggelse."},
    {n:"F. corporis femoris",icd:"DS72.3",tx:"Indlæggelse til osteosyntese (oftest marvsøm). Temporær plasterstræk kan anlægges. IV-adgang + smertestillende.",fu:"Indlæggelse."},
    {n:"Coxitis / epifysiolyse (barn)",tx:"Drenge 5-10 år. Rtg./UL mhp. ledvæske. Indlæggelse til diagnostisk ledpunktur og antibiotika. Epifysiolyse: konferer OUH.",fu:"Indlæggelse."},
  ],
  knee:[
    {n:"Distorsio genu",icd:"DS83.6",tx:"RICE + støttebind + håndkøbs smertestillende. Krykkestokke ved udtalt smerte.",fu:"EL 2-3 uger."},
    {n:"Ruptura ACL/PCL",icd:"DS83.5",tx:"Lachmanns test / bagre skuffetest. Rtg. (Eminentia/Segond-fraktur?). Ingen fraktur: ulåst Don-Joy + krykkestokke. Fraktur: CT + ort. kir. konf.",fu:"Idrætsamb. (Næstved) 2-3 uger."},
    {n:"F. patellae",icd:"DS82.0",tx:"BESKRIV ekstensionsevne og hudlæsion! Udisloceret: Don-Joy låst 0-30° i 6-8 uger. Disloceret/transversalt/komminut: indlæggelse til osteosyntese.",fu:"Amb. + rtg. 10-14 dage."},
    {n:"F. condyli tibiae",icd:"DS82.1",tx:"Akut CT-skanning mhp. operation. Eminentia-fraktur: kontakt Køge. Segond-fraktur: patognomisk for ACL-læsion.",fu:"Akut ort. kir. vurdering."},
    {n:"Luxatio patellae",icd:"DS83.0",tx:"Reponering (evt. morfin). Ekstendering roligt med let medialt pres. Rtg. inkl. sky-line efter reponering. Don-Joy 0-30° i 3 uger.",fu:"EL 3 uger. Idrætsamb. ved primær <30 år."},
    {n:"Ruptura traumatica menisci",icd:"DS83.2",tx:"Ledlinje ømhed. Aflåst knæ: konf. ort. kir. subakut artroskopi <7 dage. Ikke-aflåst: RICE + krykkestokke.",fu:"EL 4 uger."},
    {n:"Quadriceps/patella-sene ruptur",tx:"Nedsat/manglende ekstensionskraft + palpabel defekt. Kontakt ort. kir. til vurdering/operation. Strakt låst Don-Joy temporært.",fu:"Akut ort. kir."},
  ],
  lower_leg:[
    {n:"F. corporis tibiae",icd:"DS82.2",tx:"Udisloceret lukket: høj bagre gipsskinne 1-2 uger → cirkulær gips. Ustabil/åben: indlæggelse til osteosyntese. Distale ½: akut CT. OBS: compartment syndrome (pain, pallor, pulseless, paresthesia)!",fu:"Cirkulering 1-2 uger. Rtg. 6 uger + månedligt."},
    {n:"F. corporis fibulae",icd:"DS82.4",tx:"Isoleret direkte traume: walker 3 uger eller ingen bandagering. Udeluk del af pronationsskade! OBS peroneusparese.",fu:"Ingen kontrol."},
    {n:"Læsio traumatica tendina achilles",icd:"DS86.0",tx:"Positiv Thompsons test + palpabel defekt. Konservativt FØRSTEVALG: walker + 4 kiler. Fysioterapi start 2 uger (kilereduktion). ALTID spidsfodsstilling ved af-/påtagning. Total behandlingstid ≥8 uger.",fu:"Fysioterapi 2 uger. Amb. kontrol."},
  ],
  ankle:[
    {n:"F. malleoli",icd:"DS82.6",tx:"Klassificér efter Lauge Hansen. Oplagte fejlstillinger: grovreponering i morfin + gipsskinne FØR rtg. Konservativ (SA1/SU2 <2 mm, ingen medial ømhed): air-cast/walker, fuld støtte 6 uger. Øvrige: klargøring til OP. Åben fraktur: IV AB + Te-booster straks.",fu:"Rtg. 7-10 dage."},
    {n:"Distorsio regionis malleoli",icd:"DS93.4",tx:"Ottawa Ankle Rules. Grad 1 (støtter umiddelbart): RICE. Grad 2 (udtalt halten): RICE + smertestillende. Grad 3 (ingen støtte): RICE + krykkestokke + aircast. OBS: achilles, tib. post., peroneus, talus!",fu:"Ingen (grad 1) / EL 2 uger (grad 2-3)."},
    {n:"F. tibia distalis (pilon)",icd:"DS82.3",tx:"Udisloceret ekstraarticulær: konf. ort. kir. Disloceret ekstraarticulær: indlæggelse + osteosyntese. Intraarticulær: indlæggelse + CT + temporær ekstern fiksation 7-10 dage inden definitiv OP.",fu:"Rtg. + amb. 7-10 dage."},
    {n:"Epifysiolyse distale fibula/tibia (barn)",tx:"Udisloceret: bagre gipsskinne 1-2 uger. Disloceret: indlæggelse til reposition og evt. fiksation. Tillaux/Triplan-fraktur: CT + ort. kir.",fu:"Rtg. 1 og 4 uger."},
  ],
  foot:[
    {n:"F. tali",icd:"DS92.1",tx:"CT-skanning (alle). Udisloceret: walker 8 uger, ingen støtte 6-8 uger. Disloceret: konf. OUH.",fu:"Rtg. amb. 2 og 6 uger."},
    {n:"F. calcani",icd:"DS92.0",tx:"Mål Bøhler-vinklen (normal 20-40°). Udisloceret: ingen bandage, elevation, ubelastede bevægeøvelser, ingen støtte 6 uger. Disloceret: CT + konf. OUH mhp. OP.",fu:"Rtg. amb. 2 uger."},
    {n:"F. metatarsi I",icd:"DS92.3",tx:"Udisloceret: walker 4 uger. Disloceret: konf. Køge mhp. OP.",fu:"Rtg. + KK 4 uger."},
    {n:"F. metatarsi II-IV",icd:"DS92.3",tx:"Udisloceret: walker 2-3 uger + daglige vippeøvelser u. støvle. Disloceret: konf. Køge om OP, ellers walker + kontrol 14 dage.",fu:"Rtg. + KK 4 uger."},
    {n:"F. metatarsi V (Jones/tuberositas/midtskaft)",icd:"DS92.3",tx:"Tuberositas avulsion <2 mm: walker + krykkestokke 4 uger. Jones-fraktur/midtskaft: walker 6 uger (kun skyggestøtte 4 uger) – dårlig heling, pseudoartrose-risiko! Disloceret: konf. Køge.",fu:"Rtg. + KK 6 uger."},
    {n:"F. digiti pedis",icd:"DS92.4-5",tx:"1. tå udisloceret: plasterspica + stivbundet fodtøj 3-4 uger. 1. tå disloceret: reponering + konf. Køge mhp. K-tråd. Øvrige tæer: buddy-taping/harlowwood + stivbundet fodtøj 5-6 uger.",fu:"Ingen rutinekontrol."},
    {n:"Frakturluksationer midtfod (LisFranc/Chopart)",tx:"Belastningssmerte i mellemfod. Rtg. stående (bilateral). CT AKUT + konf. Køge.",fu:"Akut ort. kir."},
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

function DxCard({ dx, color, open, onToggle }) {
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
            <div style={{fontSize:13,lineHeight:1.7,color:"var(--color-text-secondary)"}}>
              {dx.tx}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:5}}>
              Opfølgning
            </div>
            <div style={{fontSize:13,lineHeight:1.6,color:color,fontWeight:500}}>
              {dx.fu}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [sel, setSel] = useState(null);
  const [hov, setHov] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);

  const handleSel = (id) => { setSel(id); setOpenIdx(null); };
  const color = sel ? COLORS[sel] : "#378ADD";
  const label = sel ? LABELS[sel] : null;
  const hovLabel = hov ? LABELS[hov] : null;
  const dxList = sel ? DATA[sel] : null;

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
        <div style={{textAlign:"center", marginBottom:12, width:"100%"}}>
          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",letterSpacing:"0.04em"}}>
            Skadestueinstruks
          </div>
          <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:2}}>
            Slagelse Hospital
          </div>
        </div>

        <div style={{minHeight:26,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}>
          {(hovLabel || label) && (
            <div style={{
              padding:"3px 10px", borderRadius:3,
              fontSize:11, fontWeight:500,
              background: (hovLabel && !sel) ? "var(--color-background-tertiary)" : color+"15",
              border:`0.5px solid ${(hovLabel && !sel) ? "var(--color-border-tertiary)" : color+"40"}`,
              color: (hovLabel && !sel) ? "var(--color-text-secondary)" : color,
              maxWidth:"100%", textAlign:"center",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            }}>
              {hovLabel || label}
            </div>
          )}
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
                {lbl.split(",")[0].split(" ").slice(0,2).join(" ")}
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
              Klik på et område i kropsdiagrammet til venstre, eller brug genvejsknapperne, for at se behandlingsinstrukser for det pågældende anatomiske område.
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
                <div style={{
                  display:"inline-block",
                  fontSize:10, fontWeight:500, letterSpacing:"0.08em",
                  textTransform:"uppercase",
                  background: color+"18",
                  color: color,
                  padding:"2px 9px", borderRadius:3,
                  marginBottom:8,
                }}>
                  Behandling
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
              EL = Egen læge · KK = Klinisk kontrol · Rtg = Røntgen · Amb = Ambulatorium · OUH = Odense Universitetshospital · OP = Operation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
