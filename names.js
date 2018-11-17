// Version 0.01

/**
* function generate a baby name from two parents
*/
function generateBabyName(maleName, femaleName, gender) {
    // console.log('generate '+gender+' baby for '+maleName+' & '+femaleName);
    // male first
    let stop = false;
    let ethnicM = null;
    for (let i = 0; !stop && i < maleCeltic.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleCeltic[i]) {
        stop = true;
        ethnicM = 'celtic';
      }
    }
    for (let i = 0; !stop && i < maleScandinavian.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleScandinavian[i]) {
        stop = true;
        ethnicM = 'scandinavian';
      }
    }
    for (let i = 0; !stop && i < maleAmerican.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleAmerican[i]) {
        stop = true;
        ethnicM = 'american';
      }
    }
    for (let i = 0; !stop && i < maleJapanese.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleJapanese[i]) {
        stop = true;
        ethnicM = 'japanese';
      }
    }
    for (let i = 0; !stop && i < maleIslander.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleIslander[i]) {
        stop = true;
        ethnicM = 'islander';
      }
    }
    for (let i = 0; !stop && i < maleAfrican.length; i++) {
      // find the name first to determine which pool to draw from
      if (maleName == maleAfrican[i]) {
        stop = true;
        ethnicM = 'african';
      }
    }

    let nameLogic = 'random';
    if (Math.random() < 0.45) {
      nameLogic = 'parent1';
    } else if (Math.random() < 0.9) {
      nameLogic = 'parent2';
    }

    if (nameLogic == 'random') {
      if (gender == 'boy') {
        return getRandomMaleName();
      } else {
        return getRandomFemaleName();
      }
    } else if (nameLogic == 'parent1') {
      if (ethnicM == 'celtic') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleCeltic.length);
          return maleCeltic[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleCeltic.length);
          return femaleCeltic[thisSeed];
        }
      } else if (ethnicM == 'scandinavian') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleScandinavian.length);
          return maleScandinavian[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleScandinavian.length);
          return femaleScandinavian[thisSeed];
        }
      } else if (ethnicM == 'japanese') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleJapanese.length);
          return maleJapanese[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleJapanese.length);
          return femaleJapanese[thisSeed];
        }
      } else if (ethnicM == 'american') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleAmerican.length);
          return maleAmerican[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleAmerican.length);
          return femaleAmerican[thisSeed];
        }
      } else if (ethnicM == 'islander') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleIslander.length);
          return maleIslander[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleIslander.length);
          return femaleIslander[thisSeed];
        }
      } else if (ethnicM == 'african') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleAfrican.length);
          return maleAfrican[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleAfrican.length);
          return femaleAfrican[thisSeed];
        }
      }
    } else {
      // now female
      stop = false;
      target = null;
      let ethnicF = null;
      for (let i = 0; !stop && i < femaleCeltic.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleCeltic[i]) {
          stop = true;
          ethnicF = 'celtic';
        }
      }
      for (let i = 0; !stop && i < femaleScandinavian.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleScandinavian[i]) {
          stop = true;
          ethnicF = 'scandinavian';
        }
      }
      for (let i = 0; !stop && i < femaleAmerican.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleAmerican[i]) {
          stop = true;
          ethnicF = 'american';
        }
      }
      for (let i = 0; !stop && i < femaleJapanese.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleJapanese[i]) {
          stop = true;
          ethnicF = 'japanese';
        }
      }
      for (let i = 0; !stop && i < femaleIslander.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleIslander[i]) {
          stop = true;
          ethnicF = 'islander';
        }
      }
      for (let i = 0; !stop && i < femaleAfrican.length; i++) {
        // find the name first to determine which pool to draw from
        if (femaleName == femaleAfrican[i]) {
          stop = true;
          ethnicF = 'african';
        }
      }
      // now process it
      if (ethnicF == 'celtic') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleCeltic.length);
          return maleCeltic[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleCeltic.length);
          return femaleCeltic[thisSeed];
        }
      } else if (ethnicF == 'scandinavian') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleScandinavian.length);
          return maleScandinavian[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleScandinavian.length);
          return femaleScandinavian[thisSeed];
        }
      } else if (ethnicF == 'japanese') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleJapanese.length);
          return maleJapanese[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleJapanese.length);
          return femaleJapanese[thisSeed];
        }
      } else if (ethnicF == 'american') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleAmerican.length);
          return maleAmerican[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleAmerican.length);
          return femaleAmerican[thisSeed];
        }
      } else if (ethnicF == 'islander') {
        if (gender == 'boy') {
          let thisSeed = Math.floor(Math.random()*maleIslander.length);
          return maleIslander[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleIslander.length);
          return femaleIslander[thisSeed];
        }
      } else if (ethnicF == 'african') {
        if (gender == 'girl') {
          let thisSeed = Math.floor(Math.random()*maleAfrican.length);
          return maleAfrican[thisSeed];
        } else {
          let thisSeed = Math.floor(Math.random()*femaleAfrican.length);
          return femaleAfrican[thisSeed];
        }
      }
    }
  };
  function getRandomMaleName(seed) {
    if (!(seed >= 0) && !(seed <= 300)) {
      seed = Math.floor(Math.random()*totalMaleNames);
    }
    if (seed < maleCeltic.length) {
      return maleCeltic[seed];
    } else if (seed < (maleScandinavian.length + maleCeltic.length)) {
      let seedTrans = (seed - maleCeltic.length);
      return maleScandinavian[seedTrans];
    } else if (seed < (maleJapanese.length + maleScandinavian.length + maleCeltic.length)) {
      let seedTrans = (seed - (maleScandinavian.length + maleCeltic.length));
      return maleJapanese[seedTrans];
    } else if (seed < (maleAmerican.length + maleJapanese.length + maleScandinavian.length + maleCeltic.length)) {
      let seedTrans = (seed - (maleJapanese.length + maleScandinavian.length + maleCeltic.length));
      return maleAmerican[seedTrans];
    } else if (seed < (maleIslander.length + maleAmerican.length + maleJapanese.length + maleScandinavian.length + maleCeltic.length)) {
      let seedTrans = (seed - (maleAmerican.length + maleJapanese.length + maleScandinavian.length + maleCeltic.length));
      return maleIslander[seedTrans];
    } else if (seed < (maleAfrican.length + maleIslander.length + maleAmerican.length + maleJapanese.length + maleScandinavian.length + maleCeltic.length)) {
      let seedTrans = (seed - (maleIslander.length + maleAmerican.length + maleJapanese.length + maleScandinavian.length + maleCeltic.length));
      return maleAfrican[seedTrans];
    }
    console.log('error m');
  };
  function getRandomFemaleName(seed) {
    if (!(seed >= 0) && !(seed <= 300)) {
      seed = Math.floor(Math.random()*totalMaleNames);
    }
    if (seed < femaleCeltic.length) {
      return femaleCeltic[seed];
    } else if (seed < (femaleScandinavian.length + femaleCeltic.length)) {
      let seedTrans = (seed - femaleCeltic.length);
      return femaleScandinavian[seedTrans];
    } else if (seed < (femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length)) {
      let seedTrans = (seed - (femaleScandinavian.length + femaleCeltic.length));
      return femaleJapanese[seedTrans];
    } else if (seed < (femaleAmerican.length + femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length)) {
      let seedTrans = (seed - (femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length));
      return femaleAmerican[seedTrans];
    } else if (seed < (femaleIslander.length + femaleAmerican.length + femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length)) {
      let seedTrans = (seed - (femaleAmerican.length + femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length));
      return femaleIslander[seedTrans];
    } else if (seed < (femaleAfrican.length + femaleIslander.length + femaleAmerican.length + femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length)) {
      let seedTrans = (seed - (femaleIslander.length + femaleAmerican.length + femaleJapanese.length + femaleScandinavian.length + femaleCeltic.length));
      return femaleAfrican[seedTrans];
    }
    console.log('error m');
  };
  function reportNames() {
    return totalMaleNames +' male and '+totalFemaleNames+' female names found in database.\n'+maleCeltic.length+' '+femaleCeltic.length+' Celtic\n'+maleAmerican.length+' '+femaleAmerican.length+' American\n'+maleJapanese.length+' '+femaleJapanese.length+' Japanese\n'+maleIslander.length+' '+femaleIslander.length+' islander\n'+maleScandinavian.length+' '+femaleScandinavian.length+' scandinavian\n'+maleAfrican.length+' '+femaleAfrican.length+' african';
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
  'Tarĸik',
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
  'Xochiqutzal',
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
  'Jel',
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


const totalMaleNames = maleScandinavian.length + maleCeltic.length + maleAmerican.length + maleJapanese.length + maleIslander.length + maleAfrican.length;
const totalFemaleNames = femaleScandinavian.length + femaleCeltic.length + femaleAmerican.length + femaleJapanese.length + femaleIslander.length + femaleAfrican.length;
