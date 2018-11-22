// Version 0.03
const numlibs = 9;
const namesinlib = 50;
/**
* function generate a baby name from two parents
 * @param {string} maleName - the male parent's name
 * @param {string} femaleName - the female parent's name
 * @param {string} gender - the desired gender
*/
function generateBabyName(maleName, femaleName, gender) {
    // console.log('generate '+gender+' baby for '+maleName+' & '+femaleName);
    let stop = false;
    let ethnic = null;
    let thisSeed = null;
    let nameLogic = 'random';
    let nameLogicChance = Math.random();
    if (nameLogicChance < 0.49) {
      nameLogic = 'maleParent';
    } else if (nameLogicChance < 0.98) {
      nameLogic = 'femaleParent';
    }
    if (nameLogic == 'random') {
  if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
        return getMaleName(Math.floor(Math.random()*((numlibs * namesinlib))));
      } else {
        return getFemaleName(Math.floor(Math.random()*((numlibs * namesinlib))));
      }
      // male parent
    } else if (nameLogic == 'maleParent') {
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleCeltic[i]) {
          stop = true;
          ethnic = 'celtic';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleScandinavian[i]) {
          stop = true;
          ethnic = 'scandinavian';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleAmerican[i]) {
          stop = true;
          ethnic = 'american';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleJapanese[i]) {
          stop = true;
          ethnic = 'japanese';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleIslander[i]) {
          stop = true;
          ethnic = 'islander';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleAfrican[i]) {
          stop = true;
          ethnic = 'african';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleChinese[i]) {
          stop = true;
          ethnic = 'chinese';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleGermanic[i]) {
          stop = true;
          ethnic = 'germanic';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (maleName == maleIndian[i]) {
          stop = true;
          ethnic = 'indian';
        }
      }
      if (ethnic == null) {
        console.log('Error: M '+maleName+' not found in library '+ethnic);
      }
    } else {
      // now female
      stop = false;
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleCeltic[i]) {
          stop = true;
          ethnic = 'celtic';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleScandinavian[i]) {
          stop = true;
          ethnic = 'scandinavian';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleAmerican[i]) {
          stop = true;
          ethnic = 'american';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleJapanese[i]) {
          stop = true;
          ethnic = 'japanese';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleIslander[i]) {
          stop = true;
          ethnic = 'islander';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleAfrican[i]) {
          stop = true;
          ethnic = 'african';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleChinese[i]) {
          stop = true;
          ethnic = 'chinese';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleGermanic[i]) {
          stop = true;
          ethnic = 'germanic';
        }
      }
      for (let i = 0; !stop && i < namesinlib; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleIndian[i]) {
          stop = true;
          ethnic = 'indian';
        }
      }
      if (ethnic == null) {
        console.log('Error: F '+femaleName+' not found in library '+ethnic);
      }
    }

      // now process it
      let result = null;
      if (ethnic == 'celtic') {
        if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleCeltic[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleCeltic[thisSeed];
        }
      } else if (ethnic == 'scandinavian') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleScandinavian[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleScandinavian[thisSeed];
        }
      } else if (ethnic == 'japanese') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleJapanese[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleJapanese[thisSeed];
        }
      } else if (ethnic == 'american') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleAmerican[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleAmerican[thisSeed];
        }
      } else if (ethnic == 'islander') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleIslander[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleIslander[thisSeed];
        }
      } else if (ethnic == 'african') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleAfrican[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleAfrican[thisSeed];
        }
      } else if (ethnic == 'chinese') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleChinese[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleChinese[thisSeed];
        }
      } else if (ethnic == 'germanic') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleGermanic[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleGermanic[thisSeed];
        }
      } else if (ethnic == 'indian') {
    if (gender == 'Male' || (gender == 'non binary' && Math.random() < 0.5)) {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = maleIndian[thisSeed];
        } else {
          thisSeed = Math.floor(Math.random()*namesinlib);
          result = femaleIndian[thisSeed];
        }
      }
      while (result == maleName || result == femaleName) {
        result = generateBabyName(maleName, femaleName, gender);
        console.log('prevented from picking identical name '+result);
      }
      if (result == null) {
        console.log('Stop is '+stop+' Ethnic was '+ethnic+' namelogic was '+nameLogic+' Parents were '+maleName+' & '+femaleName+' gender was '+gender+' seed was '+thisSeed);
      }
      return result;
  };
  function getRandomName(seed) {
    let seedTrans = seed;
    if (seed < namesinlib) {
      return maleCeltic[seed];
    } else if (seed < (2 * namesinlib)) {
      seedTrans = (seed - namesinlib);
      return maleScandinavian[seedTrans];
    } else if (seed < (3 * namesinlib)) {
      seedTrans = (seed - (2 * namesinlib));
      return maleJapanese[seedTrans];
    } else if (seed < (4 * namesinlib)) {
      seedTrans = (seed - (3 * namesinlib));
      return maleAmerican[seedTrans];
    } else if (seed < (5 * namesinlib)) {
      seedTrans = (seed - (4 * namesinlib));
      return maleIslander[seedTrans];
    } else if (seed < (6 * namesinlib)) {
      seedTrans = (seed - (5 * namesinlib));
      return maleAfrican[seedTrans];
    } else if (seed < (7 * namesinlib)) {
      seedTrans = (seed - (6 * namesinlib));
      return maleChinese[seedTrans];
    } else if (seed < (8 * namesinlib)) {
      seedTrans = (seed - (7 * namesinlib));
      debugString = ' '+seed+' celtic female '+femaleCeltic[seedTrans];
      return femaleCeltic[seedTrans];
    } else if (seed < (9 * namesinlib)) {
      seedTrans = (seed - (8 * namesinlib));
      return femaleScandinavian[seedTrans];
    } else if (seed < (10 * namesinlib)) {
      seedTrans = (seed - (9 * namesinlib));
      return femaleJapanese[seedTrans];
    } else if (seed < (11 * namesinlib)) {
      seedTrans = (seed - (10 * namesinlib));
      return femaleAmerican[seedTrans];
    } else if (seed < (12 * namesinlib)) {
      seedTrans = (seed - (11 * namesinlib));
      return femaleIslander[seedTrans];
    } else if (seed < (13 * namesinlib)) {
      seedTrans = (seed - (12 * namesinlib));
      return femaleAfrican[seedTrans];
    } else if (seed < (14 * namesinlib)) {
      seedTrans = (seed - (13 * namesinlib));
      return femaleChinese[seedTrans];
    } else if (seed < (15 * namesinlib)) {
      seedTrans = (seed - (14 * namesinlib));
      return maleGermanic[seedTrans];
    } else if (seed < (16 * namesinlib)) {
      seedTrans = (seed - (15 * namesinlib));
      return femaleGermanic[seedTrans];
    } else if (seed < (17 * namesinlib)) {
      seedTrans = (seed - (16 * namesinlib));
      return maleIndian[seedTrans];
    } else if (seed < (18 * namesinlib)) {
      seedTrans = (seed - (17 * namesinlib));
      return femaleIndian[seedTrans];
    }
    console.log('error m');
  };

  // feed it 0 - 6
  function getRandomMaleEthnicName(ethnicity) {
    if (ethnicity < 1) {
      return maleCeltic[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 2) {
      return maleScandinavian[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 3) {
      return maleJapanese[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 4) {
      return maleAmerican[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 5) {
      return maleIslander[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 6) {
      return maleAfrican[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 7) {
      return maleChinese[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 8) {
      return maleGermanic[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 9) {
      return maleIndian[Math.round(Math.random()*namesinlib)];
    }
    sendMessage('oops M '+ethinicity);
}

// feed it 0 - 6
  function getRandomFemaleEthnicName(ethnicity) {
    if (ethnicity < 1) {
      return femaleCeltic[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 2) {
      return femaleScandinavian[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 3) {
      return femaleJapanese[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 4) {
      return femaleAmerican[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 5) {
      return femaleIslander[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 6) {
      return femaleAfrican[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 7) {
      return femaleChinese[Math.round(Math.random()*namesinlib)];
    } else if (ethnicity < 8) {
      return femaleGermanic[Math.round(Math.random()*namesinlib)];
    }  else if (ethnicity < 9) {
      return femaleIndian[Math.round(Math.random()*namesinlib)];
    }
    sendMessage('oops F '+ethinicity);
  }

  function getMaleName(index) {
    let seedTrans = index;
    if (index < namesinlib) {
      return maleCeltic[index];
    } else if (index < (2 * namesinlib)) {
      seedTrans = (index - namesinlib);
      return maleScandinavian[seedTrans];
    } else if (index < (3 * namesinlib)) {
      seedTrans = (index - (2 * namesinlib));
      return maleJapanese[seedTrans];
    } else if (index < (4 * namesinlib)) {
      seedTrans = (index - (3 * namesinlib));
      return maleAmerican[seedTrans];
    } else if (index < (5 * namesinlib)) {
      seedTrans = (index - (4 * namesinlib));
      return maleIslander[seedTrans];
    } else if (index < (6 * namesinlib)) {
      seedTrans = (index - (5 * namesinlib));
      return maleAfrican[seedTrans];
    } else if (index < (7 * namesinlib)) {
      seedTrans = (index - (6 * namesinlib));
      return maleChinese[seedTrans];
    } else if (index < (8 * namesinlib)) {
      seedTrans = (index - (7 * namesinlib));
      return maleGermanic[seedTrans];
    } else if (index < (9 * namesinlib)) {
      seedTrans = (index - (8 * namesinlib));
      return maleIndian[seedTrans];
    }
    console.log('error m');
  };
  function getFemaleName(index) {
    let seedTrans = index;
    if (index < namesinlib) {
      return femaleCeltic[index];
    } else if (index < (2 * namesinlib)) {
      seedTrans = (index - namesinlib);
      return femaleScandinavian[seedTrans];
    } else if (index < (3 * namesinlib)) {
      seedTrans = (index - (2 * namesinlib));
      return femaleJapanese[seedTrans];
    } else if (index < (4 * namesinlib)) {
      seedTrans = (index - (3 * namesinlib));
      return femaleAmerican[seedTrans];
    } else if (index < (5 * namesinlib)) {
      seedTrans = (index - (4 * namesinlib));
      return femaleIslander[seedTrans];
    } else if (index < (6 * namesinlib)) {
      seedTrans = (index - (5 * namesinlib));
      return femaleAfrican[seedTrans];
    } else if (index < (7 * namesinlib)) {
      seedTrans = (index - (6 * namesinlib));
      return femaleChinese[seedTrans];
    } else if (index < (8 * namesinlib)) {
      seedTrans = (index - (7 * namesinlib));
      return femaleGermanic[seedTrans];
    } else if (index < (9 * namesinlib)) {
      seedTrans = (index - (8 * namesinlib));
      return femaleIndian[seedTrans];
    }
    console.log('error m');
  };

  function reportNames(runtimes) {
    // STRESS TESTING
    console.log('Checking integrity of names database');
    for (let i = 0; i < namesinlib*numlibs; i++) {
      if (getRandomName(i) == undefined) {
        console.log('undefined name found '+i+debugString);
     }
      for (let j = 0; j < namesinlib*numlibs; j++) {
        if (i !== j && getRandomName(i) == getRandomName(j)) {
          console.log('duplicate name found '+i+debugString);
       }
      }
    }
    // let stop = false;
    // let t = 0;
    // let gname = getFemaleName(Math.round(Math.random()*totalFemaleNames));
    // let bname = getMaleName(Math.round(Math.random()*totalMaleNames));
    // for (t = 0; t < runtimes && !stop; t++) {
    //   gname = generateBabyName(bname, gname, 'Female');
    //   bname = generateBabyName(bname, gname, 'Male');
    //   if (gname == null) {
    //     console.log('null name after '+t+' parents were '+myGuys[1].name+' and '+gname);
    //     stop = true;
    //   }
    //   if (bname == null) {
    //     console.log('null name after '+t+' parents were '+bname+' and '+myGuys[0].name);
    //     stop = true;
    //   }
    // }
    // gname = getRandomFemaleEthnicName(Math.round(Math.random()*(numlibs-1)));
    // bname = getRandomMaleEthnicName(Math.round(Math.random()*(numlibs-1)));
    // for (t = 0; t < 10000 && !stop; t++) {
    //   gname = generateBabyName(bname, gname, 'Female');
    //   bname = generateBabyName(bname, gname, 'Male');
    //   if (gname == null) {
    //     console.log('null name after '+t+' parents were '+myGuys[1].name+' and '+gname);
    //     stop = true;
    //   }
    //   if (bname == null) {
    //     console.log('null name after '+t+' parents were '+bname+' and '+myGuys[0].name);
    //     stop = true;
    //   }
    // }
    // console.log('passed test '+t+' times');
    return totalMaleNames +' male / '+totalFemaleNames+' female names found\n'
    +maleAfrican.length+' '+femaleAfrican.length+' african\n'
    +maleAmerican.length+' '+femaleAmerican.length+' american\n'
    +maleCeltic.length+' '+femaleCeltic.length+' celtic\n'
    +maleChinese.length+' '+femaleChinese.length+' chinese\n'
    +maleIslander.length+' '+femaleIslander.length+' islander\n'
    +maleJapanese.length+' '+femaleJapanese.length+' japanese\n'
    +maleIndian.length+' '+femaleIndian.length+' indian\n'
    +maleGermanic.length+' '+femaleGermanic.length+' germanic';
  };


const maleCeltic = [
  // celtic
  'Adair',
  'Aidan',
  'Aeron',
  'Ahearn',
  'Angus',
  'Bledig',
  'Brenin',
  'Brychan',
  'Cadoc',
  'Cian',
  'Diarmid',
  'Donnan',
  'Conor',
  'Dewi',
  'Dylan',
  'Eachann',
  'Elisud',
  'Ewan',
  'Fergus',
  'Finn',
  'Gar',
  'Glyn',
  'Griffin',
  'Gwalchgwyn',
  'Iestyn',
  'Ieuan',
  'Ioan',
  'Lachlan',
  'Logan',
  'Llew',
  'Macsen',
  'Manawydan',
  'Matholwch',
  'Niall',
  'Oenghus',
  'Oisin',
  'Peredyr',
  'Pryderi',
  'Pwyll',
  'Rory',
  'Sion',
  'Stefan',
  'Tegeirian',
  'Terryn',
  'Talog',
  'Tamhas',
  'Taron',
  'Tomos',
  'Trystan',
  'Tudor',
];

const femaleCeltic = [
  // celtic
  'Aeval',
  'Ailsa',
  'Aileen',
  'Aine',
  'Angharad',
  'Aoife',
  'Arabel',
  'Aranrhod',
  'Blodeuyn',
  'Branwen',
  'Caoimhe',
  'Catriona',
  'Cerian',
  'Ceridwen',
  'Cernunnos',
  'Conchenn',
  'Deoiridh',
  'Efa',
  'Elen',
  'Epona',
  'Eirian',
  'Fionnuala',
  'Goewyn',
  'Gwawr',
  'Greer',
  'Hedydd',
  'Isla',
  'Jura',
  'Lili',
  'Maebh',
  'Maeve',
  'Manannan',
  'Mererid',
  'Mhairi',
  'Morrigan',
  'Nesta',
  'Nia',
  'Niamh',
  'Olwen',
  'Rhiannon',
  'Seren',
  'Saoirse',
  'Siobhan',
  'Sinead',
  'Siriol',
  'Sorcha',
  'Swyn',
  'Tegan',
  'Taryn',
  'Una',
];


const maleScandinavian = [
  // scandinavian
  'Aaric',
  'Aksel',
  'Andhrimnir',
  'Alfadir',
  'Arvid',
  'Astrild',
  'Amhlaoibh',
  'Bragi',
  'Dag',
  'Ersbjorn',
  'Fandral',
  'Fell',
  'Folke',
  'Grim',
  'Gunnolf',
  'Gustav',
  'Heimdall',
  'Holgan',
  'Hjalmar',
  'Isak',
  'Jormingand',
  'Jorn',
  'Jutka',
  'Kjartan',
  'Loki',
  'Loui',
  'Ludvig',
  'Magni',
  'Malte',
  'Modi',
  'Melker',
  'Mimir',
  'Nils',
  'Njal',
  'Njord',
  'Odin',
  'Otto',
  'Radorm',
  'Sigge',
  'Sindri',
  'Sleipnir',
  'Tage',
  'Thorbiartl',
  'Thorne',
  'Troy',
  'Valmiki',
  'Vide',
  'Viggo',
  'Volstaff',
  'Yisreal',
];

const femaleScandinavian = [
  // scandinavian
  'Alma',
  'Astrid',
  'Atla',
  'Brynhild',
  'Bylgia',
  'Eir',
  'Freya',
  'Freyr',
  'Fulla',
  'Gale',
  'Gefion',
  'Greta',
  'Gunnhild',
  'Hedda',
  'Hedvig',
  'Hela',
  'Hilde',
  'Indunn',
  'Ines',
  'Ingrid',
  'Jord',
  'Lofn',
  'Lova',
  'Majken',
  'Maja',
  'Moa',
  'Noomi',
  'Nott',
  'Ostara',
  'Rae',
  'Ragnhild',
  'Ran',
  'Ranveig',
  'Saga',
  'Signe',
  'Sigrid',
  'Sigrunn',
  'Sif',
  'Skadi',
  'Sjofn',
  'Sjojn',
  'Solveig',
  'Svanhild',
  'Torhild',
  'Torunn',
  'Tyra',
  'Var',
  'Vigdis',
  'Voluspa',
  'Yngvild',
];

const maleAmerican = [
  // native American / mayan / incan / aztec
  'Ahuatzi',
  'Amaruq',
  'Aviaja',
  'Camaxtli',
  'Cinteotl',
  'Cipactonal',
  'Coatlicue',
  'Dahteste',
  'Ekchuah',
  'Eueucoyotl',
  'Hiawatha',
  'Hokaratcha',
  'Huacaltzintli',
  'Huehuecoyotl',
  'Huitzilin',
  'Itzcali',
  'Itzcoatl',
  'Ixchel',
  'Kaiah',
  'Kimimela',
  'Kumaglak',
  'Maconaquea',
  'Mixcoatl',
  'Mextli',
  'Nacon',
  'Nochehuatl',
  'Ocotlan',
  'Pakuna',
  'Panuk',
  'Papina',
  'Pebbles',
  'Pocahontas',
  'Sakakawea',
  'Shenandoah',
  'Tenoch',
  'Tarkik',
  'Toklo',
  'Tayatina',
  'Teanawesia',
  'Teotihuacan',
  'Tlanextic',
  'Tupelo',
  'Tupoc',
  'Ujurak',
  'Xochipilli',
  'Yoskolo',
  'Yotimo',
  'Yutu',
  'Xicotencatl',
  'Zitkala',
];

const femaleAmerican = [
  // native American / mayan / incan / aztec
  'Acolmiztli',
  'Adlartok',
  'Ahanu',
  'Aqakuktuqa',
  'Anacaona',
  'Apozanolotl',
  'Atiqtalaaq',
  'Axayacatl',
  'Byue',
  'Cherokee',
  'Chicomecoatl',
  'Chipahua',
  'Coaxoch',
  'Copacati',
  'Cuauhtemoc',
  'Cuicatl',
  'Goyahkla',
  'Ichipuchtli',
  'Ixcuiname',
  'Ixtli',
  'Ikiaq',
  'Kanaaq',
  'Kireama',
  'Kirima',
  'Kohana',
  'Lalawethika',
  'Mariana',
  'Nanouk',
  'Nenetl',
  'Nuvua',
  'Oello',
  'Pachamama',
  'Pahkakino',
  'Pontiac',
  'Quetzalcoatl',
  'Quetzalli',
  'Sequoiah',
  'Shilah',
  'Squanto',
  'Taregan',
  'Tatanka',
  'Tayanna',
  'Tecumseh',
  'Teyemthohisa',
  'Tezcatlipoca',
  'Tlazolteotl',
  'Tukkuttok',
  'Xipetotec',
  'Xochiquetzal',
  'Yactecuhtli',
];

const maleJapanese = [
  // Japanese
  'Aizen',
  'Ashitaka',
  'Asahi',
  'Amatsu',
  'Bishamon',
  'Daibosatsu',
  'Daiki',
  'Daikoku',
  'Eita',
  'Ekibiogami',
  'Funaki',
  'Fujiwara',
  'Fujukin',
  'Fukurokuju',
  'Gekka',
  'Haru',
  'Haruto',
  'Hinata',
  'Itsuki',
  'Jijii',
  'Jiro',
  'Jinushigami',
  'Kaneko',
  'Kakihara',
  'Katsushiro',
  'Koki',
  'Kukunochi',
  'Kota',
  'Nkaazawa',
  'Minato',
  'Ohkami',
  'Ohonamochi',
  'Oyamatsumi',
  'Reo',
  'Rikuto',
  'Ryu',
  'Saburo',
  'Shoma',
  'Sosuki',
  'Sota',
  'Suijin',
  'Taisei',
  'Takumi',
  'Takayama',
  'Tatsuki',
  'Tenjin',
  'Touma',
  'Yabune',
  'Yamato',
  'Yuuto',
];

const femaleJapanese = [
  // Japanese
  'Akari',
  'Aoi',
  'Ayaka',
  'Chibiusa',
  'Haniyasu',
  'Hina',
  'Himari',
  'Hime',
  'Ichika',
  'Izanami',
  'Kaminari',
  'Kamui',
  'Kanayama',
  'Kanna',
  'Koharu',
  'Kojin',
  'Kokona',
  'Kishi',
  'Makoto',
  'Mamoru',
  'Mei',
  'Michiru',
  'Minako',
  'Misaki',
  'Miyazu',
  'Miyu',
  'Momoka',
  'Nanami',
  'Natsuki',
  'Niko',
  'Ria',
  'Rio',
  'Ruka',
  'Sakura',
  'San',
  'Sana',
  'Sara',
  'Sayori',
  'Shiori',
  'Tanabata',
  'Tatsuta',
  'Toyouke',
  'Ukemochi',
  'Usagi',
  'Wakahiru',
  'Yui',
  'Yuki',
  'Yume',
  'Yuna',
  'Yuri',
];


const maleIslander = [
  // islander
  'Aleki',
  'Aheahe',
  'Afa',
  'Akamai',
  'Akamu',
  'Akea',
  'Ainalani',
  'Akeakamai',
  'Ao',
  'Apukohai',
  'Aputi',
  'Atea',
  'Atutahi',
  'Auraka',
  'Fetu',
  'Hawea',
  'Kahale',
  'Kahikilani',
  'Kaiholo',
  'Kahuna',
  'Kaikani',
  'Kaleo',
  'Kanaloa',
  'Kamapua\'a',
  'Keala',
  'Koa',
  'Kuahana',
  'Kulani',
  'Kukailimoku',
  'Lahahana',
  'Lagi',
  'Loto',
  'Iosefa',
  'Ku',
  'Manaia',
  'Manuia',
  'Maru',
  'Makaio',
  'Makoa',
  'Moaalii',
  'Mokualii',
  'Ne\'igalomeatiga',
  'Noelani',
  'Rangi',
  'Tamati',
  'Tamatoa',
  'Tui',
  'Ulaulekeahi',
  'Ukanipo',
  'Vaea',
];

const femaleIslander = [
  // islander
  'Alalahe',
  'Alani',
  'Arihi',
  'Anuhea',
  'Asoese',
  'Elei',
  'Elikapeka',
  'Emere',
  'Faumea',
  'Fetuilelagi',
  'Haukea',
  'Hinakuluiau',
  'Hokulani',
  'Iekikia',
  'Iolana',
  'Iwalani',
  'Kakalina',
  'Kala',
  'Kalea',
  'Kapo',
  'Kiha',
  'La\'akea',
  'La\'ei',
  'Lahela',
  'Leilani',
  'Leimomi',
  'Lalago',
  'Laka',
  'Lanuola',
  'Lakakane',
  'Lie',
  'Luana',
  'Mahealani',
  'Masina',
  'Moana',
  'Natia',
  'Penina',
  'Poliahu',
  'Samaria',
  'Sefina',
  'Sina',
  'Tala',
  'Taka',
  'Tama',
  'Talia',
  'Tamah',
  'Tausa\'afia',
  'Teuila',
  'Ululani',
  'Waiola',
];

const maleAfrican = [
  'Adebi',
  'Akida',
  'Asani',
  'Barke',
  'Barongo',
  'Biko',
  'Bobo',
  'Bokamoso',
  'Chandu',
  'Djimon',
  'Haji',
  'Hami',
  'Issa',
  'Fela',
  'Femi',
  'Jabali',
  'Jabori',
  'Jomo',
  'Inanna',
  'Kellan',
  'Kenyada',
  'Kolo',
  'Kimani',
  'Kito',
  'Kobe',
  'Kondo',
  'Kwame',
  'Lubanzi',
  'Maleek',
  'Morongo',
  'Mosi',
  'M\'Baku',
  'N\'Jobu',
  'Obi',
  'Omari',
  'Samora',
  'Sefu',
  'Shaka',
  'Simba',
  'Sulley',
  'Soweto',
  'Tau',
  'T\'Chaka',
  'T\'Challah',
  'Thimba',
  'W\'Kabi',
  'Yaya',
  'Zain',
  'Zababa',
  'Zuberi',
];
const femaleAfrican = [
  'Adea',
  'Adiah',
  'Aja',
  'Aiysha',
  'Akila',
  'Akina',
  'Ama',
  'Amani',
  'Amare',
  'Amina',
  'Amne',
  'Atiena',
  'Ayo',
  'Behati',
  'Bishara',
  'Chiku',
  'Hediye',
  'Imani',
  'Jamila',
  'Johari',
  'Joice',
  'Kichaka',
  'Luamerava',
  'Mosiya',
  'Maha',
  'Mbali',
  'Mbwana',
  'Mukondi',
  'Naja',
  'Nalah',
  'Nakia',
  'Nea',
  'Nya',
  'Nyasha',
  'Nyimbo',
  'Nyokabi',
  'Ode',
  'Okoye',
  'Oni',
  'Oya',
  'Ramonda',
  'Sabra',
  'Shuri',
  'Sikudhani',
  'Thabiti',
  'Thandiwe',
  'Uma',
  'Wanja',
  'Zoya',
  'Zola',
];

const maleChinese = [
  'Bao',
  'Cheng',
  'Dashuang',
  'De',
  'Dongfang',
  'Dugu',
  'Fuxi',
  'Geng',
  'Gentsai',
  'Guo',
  'Hao',
  'Huang',
  'Hoi',
  'Hsi',
  'Huaze',
  'Jin',
  'Jiang',
  'Jingshen',
  'Kang',
  'Kuan',
  'Li',
  'Liansheng',
  'Liang',
  'Mao',
  'Mushu',
  'Naiqi',
  'Pengfei',
  'Qing',
  'Shifu',
  'Shun',
  'Si',
  'Suiren',
  'Suo',
  'Sun',
  'Tianyi',
  'Tang',
  'Tzu',
  'Xiangru',
  'Xiaoqi',
  'Xiang',
  'Yang',
  'Yao',
  'Yu',
  'Yun',
  'Zengxiang',
  'Zhang',
  'Zhishen',
  'Zhi',
  'Zhongguo',
  'Zhou',
];


const femaleChinese = [
  'Ban',
  'Baobei',
  'Beibi',
  'Bingbing',
  'Chan',
  'Chin',
  'Di',
  'Du',
  'Fan',
  'Fangxiao',
  'Gaowa',
  'Jia',
  'Jie',
  'Jiao',
  'Jingchu',
  'Jingnan',
  'Jinlian',
  'Jinzhi',
  'Ke',
  'Koe',
  'Li',
  'Lingyu',
  'Meitan',
  'Mu',
  'Pan',
  'Qi',
  'Qiurui',
  'Qionqying',
  'Ren',
  'Ruan',
  'Sanniang',
  'Shen',
  'Shishi',
  'Shuo',
  'Siyao',
  'Tian',
  'Tie',
  'Wenji',
  'Xianghua',
  'Xiao',
  'Xiaoyu',
  'Xiumin',
  'Xixi',
  'Xun',
  'Yan',
  'Yi Fei',
  'Yongyan',
  'Yilin',
  'Zhao',
  'Ziyi',
];

const maleGermanic = [
  'Benedikt',
  'Dominik',
  'Elias',
  'Felix',
  'Fritz',
  'Hannes',
  'Jakob',
  'Jan',
  'Jannik',
  'Jannis',
  'Johann',
  'Johannes',
  'Jonas',
  'Joris',
  'Justus',
  'Karl',
  'Kilian',
  'Konstantin',
  'Lasse',
  'Lennart',
  'Lenni',
  'Lennox',
  'Levi',
  'Levin',
  'Lias',
  'Linus',
  'Lio',
  'Luc',
  'Luca',
  'Lukas',
  'Mads',
  'Malte',
  'Matteo',
  'Mattis',
  'Max',
  'Maxim',
  'Mika',
  'Milan',
  'Milo',
  'Moritz',
  'Niels',
  'Niklas',
  'Niko',
  'Ole',
  'Oskar',
  'Theodor',
  'Till',
  'Timo',
  'Tobias',
  'Valentin',
];

const femaleGermanic = [
  'Anni',
  'Annika',
  'Elli',
  'Eva',
  'Finja',
  'Franziska',
  'Frieda',
  'Hanna',
  'Ida',
  'Isabell',
  'Jana',
  'Jasmin',
  'Johanna',
  'Josefine',
  'Jule',
  'Juli',
  'Juna',
  'Karla',
  'Karlotta',
  'Katharina',
  'Klara',
  'Lea',
  'Lena',
  'Leni',
  'Leonie',
  'Lina',
  'Lotta',
  'Lucie',
  'Luisa',
  'Luna',
  'Lya',
  'Magda',
  'Maila',
  'Mara',
  'Martha',
  'Matilda',
  'Merle',
  'Mila',
  'Mira',
  'Neele',
  'Nora',
  'Paula',
  'Ronja',
  'Sara',
  'Sofia',
  'Sofie',
  'Teresa',
  'Tilda',
  'Viktoria',
  'Zoe',
];

const maleIndian = [
  'Aaditya',
  'Abhi',
  'Abhinav',
  'Abhishek',
  'Aditya',
  'Ajith',
  'Akash',
  'Amit',
  'Anil',
  'Anish',
  'Ankit',
  'Ankur',
  'Arjun',
  'Aryan',
  'Ashish',
  'Deepak',
  'Karan',
  'Krish',
  'Krishna',
  'Kumar',
  'Kunal',
  'Mahesh',
  'Manish',
  'Manoj',
  'Mayank',
  'Naveen',
  'Neeraj',
  'Nishant',
  'Nitin',
  'Parth',
  'Pranav',
  'Prateek',
  'Raghav',
  'Rahul',
  'Raj',
  'Raju',
  'Rakesh',
  'Rishabh',
  'Rohan',
  'Rohit',
  'Sanjay',
  'Shivam',
  'Shyam',
  'Soham',
  'Vaibhav',
  'Vikas',
  'Vinay',
  'Vishal',
  'Vivek',
  'Yash',
];

const femaleIndian = [
  'Aastha',
  'Aishwarya',
  'Akansha',
  'Ananya',
  'Anisha',
  'Anjali',
  'Anusha',
  'Anushri',
  'Arti',
  'Aswini',
  'Ayushi',
  'Divya',
  'Diya',
  'Gayatri',
  'Indhumathi',
  'Isha',
  'Ishita',
  'Kalyani',
  'Krithika',
  'Mahima',
  'Manisha',
  'Neha',
  'Niharika',
  'Nikita',
  'Nishi',
  'Nishita',
  'Pavithra',
  'Prachi',
  'Priya',
  'Priyanka',
  'Radhika',
  'Ramya',
  'Rishita',
  'Riya',
  'Rutuja',
  'Sakshi',
  'Sanjana',
  'Seema',
  'Shivangi',
  'Shivani',
  'Shreya',
  'Shrinidhi',
  'Simran',
  'Siya',
  'Sneha',
  'Suhani',
  'Tanu',
  'Tanvi',
  'Vani',
  'Varsha',
];

const totalMaleNames = (numlibs * namesinlib);
const totalFemaleNames = (numlibs * namesinlib);
