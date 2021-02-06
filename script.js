
let konsGoal = 23; //konsonant value goal
let vocGoal = 14;  //vocals values goal










//a random name generator creates new names from a list and shows 
//how much numerological value each name it has created has and what 
//its vocals and konsonants respectively are worth

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// name_generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/

  let name_set = {};
  let chain_cache = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// generator function

  function generate_name (type) {
    let chain; if (chain = markov_chain(type)) {
      return markov_name(chain);
    }
    return '';
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// generate multiple

  function name_list (type, n_of) {
    let list = [];

    let i; for (i = 0; i < n_of; i++) {
      list.push(generate_name(type));
    }
    return list;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// get markov chain by type

  function markov_chain (type) {
    let chain; if (chain = chain_cache[type]) {
      return chain;
    } else {
      let list; if ((list = name_set[type]) && list.length) {
        let chain; if (chain = construct_chain(list)) {
          chain_cache[type] = chain;
          return chain;
        }
      }
    }
    return false;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// construct markov chain from list of names

  function construct_chain (list) {
    let chain = {};

    let i; for (i = 0; i < list.length; i++) {
      let names = list[i].split(/\s+/);
      chain = incr_chain(chain,'parts',names.length);

      let j; for (j = 0; j < names.length; j++) {
        let name = names[j];
        chain = incr_chain(chain,'name_len',name.length);

        let c = name.substr(0,1);
        chain = incr_chain(chain,'initial',c);

        let string = name.substr(1);
        let last_c = c;

        while (string.length > 0) {
          let c = string.substr(0,1);
          chain = incr_chain(chain,last_c,c);

          string = string.substr(1);
          last_c = c;
        }
      }
    }
    return scale_chain(chain);
  }
  function incr_chain (chain, key, token) {
    if (chain[key]) {
      if (chain[key][token]) {
        chain[key][token]++;
      } else {
        chain[key][token] = 1;
      }
    } else {
      chain[key] = {};
      chain[key][token] = 1;
    }
    return chain;
  }
  function scale_chain (chain) {
    let table_len = {};

    Object.keys(chain).forEach(key => {
      table_len[key] = 0;

      Object.keys(chain[key]).forEach(token => {
        let count = chain[key][token];
        let weighted = Math.floor(Math.pow(count,1.3));

        chain[key][token] = weighted;
        table_len[key] += weighted;
      });
    });
    chain['table_len'] = table_len;
    return chain;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// construct name from markov chain

  function markov_name (chain) {
    let parts = select_link(chain,'parts');
    let names = [];

    let i; for (i = 0; i < parts; i++) {
      let name_len = select_link(chain,'name_len');
      let c = select_link(chain,'initial');
      let name = c;
      let last_c = c;

      while (name.length < name_len) {
        c = select_link(chain,last_c);
        name += c;
        last_c = c;
      }
      names.push(name);
    }
    return names.join(' ');
  }
  function select_link (chain, key) {
    let len = chain['table_len'][key];
    let idx = Math.floor(Math.random() * len);
    let t = 0;

    return Object.keys(chain[key]).find(token => {
      t += chain[key][token];
      return (idx < t);
    });
  }



name_set['dk'] = ['eeaaaaffdc', 'Ahmad', 'Ahmed', 'Ali', 'Andersen', 'Andersson', 'Andreasen', 'Andreassen', 'Andresen', 'Asmussen', 'Bach', 'Bak', 'Bang', 'Bech', 'Beck', 'Bendtsen', 'Berg', 'Bertelsen', 'Berthelsen', 'Bisgård', 'Bisgaard', 'Bjerre', 'Bjerregård', 'Bjerregaard', 'Bonde', 'Brandt', 'Brodersen', 'Bruun', 'Buch', 'Bundgård', 'Bundgaard', 'Carlsen', 'Carstensen', 'Christensen', 'Christiansen', 'Christoffersen', 'Clausen', 'Dahl', 'Dalgård', 'Dalgaard', 'Dalsgård', 'Dalsgaard', 'Dam', 'Damgård', 'Damgaard', 'Danielsen', 'Davidsen', 'Enevoldsen', 'Eriksen', 'Eskildsen', 'Fischer', 'Fisker', 'Frandsen', 'Frederiksen', 'Friis', 'Frost', 'Gade', 'Gregersen', 'Hald', 'Hansen', 'Hassan', 'Hedegård', 'Hedegaard', 'Hemmingsen', 'Henningsen', 'Henriksen', 'Hermansen', 'Hjorth', 'Hoffmann', 'Holm', 'Holst', 'Hougård', 'Hougaard', 'Ibsen', 'Iversen', 'Jacobsen', 'Jakobsen', 'Jensen', 'Jeppesen', 'Jepsen', 'Jespersen', 'Jessen', 'Johannesen', 'Johannsen', 'Johansen', 'Johansson', 'Johnsen', 'Juhl', 'Justesen', 'Juul', 'Jønsson', 'Jørgensen', 'Karlsen', 'Khan', 'Kirkegård', 'Kirkegaard', 'Kjeldsen', 'Kjær', 'Kjærgård', 'Kjærgaard', 'Klausen', 'Knudsen', 'Koch', 'Kofoed', 'Kragh', 'Kristensen', 'Kristiansen', 'Kristoffersen', 'Krog', 'Krogh', 'Kruse', 'Lange', 'Larsen', 'Lassen', 'Lauridsen', 'Lauritsen', 'Lauritzen', 'Laursen', 'Laustsen', 'Leth', 'Lind', 'Lindberg', 'Lorentzen', 'Lorenzen', 'Lund', 'Madsen', 'Markussen', 'Mathiasen', 'Mathiesen', 'Meyer', 'Michelsen', 'Mikkelsen', 'Mogensen', 'Mohamed', 'Mortensen', 'Munch', 'Munk', 'Müller', 'Mølgård', 'Mølgaard', 'Møller', 'Nguyen', 'Nielsen', 'Nikolajsen', 'Nilsson', 'Nissen', 'Nygård', 'Nygaard', 'Nørgård', 'Nørgaard', 'Olesen', 'Olsen', 'Olsson', 'Overgård', 'Overgaard', 'Paulsen', 'Pedersen', 'Persson', 'Petersen', 'Poulsen', 'Rasmussen', 'Ravn', 'Riis', 'Schmidt', 'Schou', 'Schrøder', 'Schultz', 'Simonsen', 'Skov', 'Skovgård', 'Skovgaard', 'Sloth', 'Sommer', 'Steffensen', 'Storm', 'Svendsen', 'Svensson', 'Søgård', 'Søgaard', 'Søndergård', 'Søndergaard', 'Sørensen', 'Thomassen', 'Thomsen', 'Thorsen', 'Thygesen', 'Thøgersen', 'Toft', 'Vestergård', 'Vestergaard', 'Villadsen', 'Vinther', 'Winther', 'Østergård', 'Østergaard', 'Ågård', 'Aagård', 'Ågaard', 'Aagaard'];



name_set['eng'] = ['SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN', 'JONES', 'MILLER', 'DAVIS', 'GARCIA', 'RODRIGUEZ', 'WILSON', 'MARTINEZ', 'ANDERSON', 'TAYLOR', 'THOMAS', 'HERNANDEZ', 'MOORE', 'MARTIN', 'JACKSON', 'THOMPSON', 'WHITE', 'LOPEZ', 'LEE', 'GONZALEZ', 'HARRIS', 'CLARK', 'LEWIS', 'ROBINSON', 'WALKER', 'PEREZ', 'HALL', 'YOUNG', 'ALLEN', 'SANCHEZ', 'WRIGHT', 'KING', 'SCOTT', 'GREEN', 'BAKER', 'ADAMS', 'NELSON', 'HILL', 'RAMIREZ', 'CAMPBELL', 'MITCHELL', 'ROBERTS', 'CARTER', 'PHILLIPS', 'EVANS', 'TURNER', 'TORRES', 'PARKER', 'COLLINS', 'EDWARDS', 'STEWART', 'FLORES', 'MORRIS', 'NGUYEN', 'MURPHY', 'RIVERA', 'COOK', 'ROGERS', 'MORGAN', 'PETERSON', 'COOPER', 'REED', 'BAILEY', 'BELL', 'GOMEZ', 'KELLY', 'HOWARD', 'WARD', 'COX', 'DIAZ', 'RICHARDSON', 'WOOD', 'WATSON', 'BROOKS', 'BENNETT', 'GRAY', 'JAMES', 'REYES', 'CRUZ', 'HUGHES', 'PRICE', 'MYERS', 'LONG', 'FOSTER', 'SANDERS', 'ROSS', 'MORALES', 'POWELL', 'SULLIVAN', 'RUSSELL', 'ORTIZ', 'JENKINS', 'GUTIERREZ', 'PERRY', 'BUTLER', 'BARNES', 'FISHER', 'HENDERSON', 'COLEMAN', 'SIMMONS', 'PATTERSON', 'JORDAN', 'REYNOLDS', 'HAMILTON', 'GRAHAM', 'KIM', 'GONZALES', 'ALEXANDER', 'RAMOS', 'WALLACE', 'GRIFFIN', 'WEST', 'COLE', 'HAYES', 'CHAVEZ', 'GIBSON', 'BRYANT', 'ELLIS', 'STEVENS', 'MURRAY', 'FORD', 'MARSHALL', 'OWENS', 'MCDONALD', 'HARRISON', 'RUIZ', 'KENNEDY', 'WELLS', 'ALVAREZ', 'WOODS', 'MENDOZA', 'CASTILLO', 'OLSON', 'WEBB', 'WASHINGTON', 'TUCKER', 'FREEMAN', 'BURNS', 'HENRY', 'VASQUEZ', 'SNYDER', 'SIMPSON', 'CRAWFORD', 'JIMENEZ', 'PORTER', 'MASON', 'SHAW', 'GORDON', 'WAGNER', 'HUNTER', 'ROMERO', 'HICKS', 'DIXON', 'HUNT', 'PALMER', 'ROBERTSON', 'BLACK', 'HOLMES', 'STONE', 'MEYER', 'BOYD', 'MILLS', 'WARREN', 'FOX', 'ROSE', 'RICE', 'MORENO', 'SCHMIDT', 'PATEL', 'FERGUSON', 'NICHOLS', 'HERRERA', 'MEDINA', 'RYAN', 'FERNANDEZ', 'WEAVER', 'DANIELS', 'STEPHENS', 'GARDNER', 'PAYNE', 'KELLEY', 'DUNN', 'PIERCE', 'ARNOLD', 'TRAN', 'SPENCER', 'PETERS', 'HAWKINS', 'GRANT', 'HANSEN', 'CASTRO', 'HOFFMAN', 'HART', 'ELLIOTT', 'CUNNINGHAM', 'KNIGHT', 'BRADLEY', 'CARROLL', 'HUDSON', 'DUNCAN', 'ARMSTRONG', 'BERRY', 'ANDREWS', 'JOHNSTON', 'RAY', 'LANE', 'RILEY', 'CARPENTER', 'PERKINS', 'AGUILAR', 'SILVA', 'RICHARDS', 'WILLIS', 'MATTHEWS', 'CHAPMAN', 'LAWRENCE', 'GARZA', 'VARGAS', 'WATKINS', 'WHEELER', 'LARSON', 'CARLSON', 'HARPER', 'GEORGE', 'GREENE', 'BURKE', 'GUZMAN', 'MORRISON', 'MUNOZ', 'JACOBS', 'OBRIEN', 'LAWSON', 'FRANKLIN', 'LYNCH', 'BISHOP', 'CARR', 'SALAZAR', 'AUSTIN', 'MENDEZ', 'GILBERT', 'JENSEN', 'WILLIAMSON', 'MONTGOMERY', 'HARVEY', 'OLIVER', 'HOWELL', 'DEAN', 'HANSON', 'WEBER', 'GARRETT', 'SIMS', 'BURTON', 'FULLER', 'SOTO', 'MCCOY', 'WELCH', 'CHEN', 'SCHULTZ', 'WALTERS', 'REID', 'FIELDS', 'WALSH', 'LITTLE', 'FOWLER', 'BOWMAN', 'DAVIDSON', 'MAY', 'DAY', 'SCHNEIDER', 'NEWMAN', 'BREWER', 'LUCAS', 'HOLLAND', 'WONG', 'BANKS', 'SANTOS', 'CURTIS', 'PEARSON', 'DELGADO', 'VALDEZ', 'PENA', 'RIOS', 'DOUGLAS', 'SANDOVAL', 'BARRETT', 'HOPKINS', 'KELLER', 'GUERRERO', 'STANLEY', 'BATES', 'ALVARADO', 'BECK', 'ORTEGA', 'WADE', 'ESTRADA', 'CONTRERAS', 'BARNETT', 'CALDWELL', 'SANTIAGO', 'LAMBERT', 'POWERS', 'CHAMBERS', 'NUNEZ', 'CRAIG', 'LEONARD', 'LOWE', 'RHODES', 'BYRD', 'GREGORY', 'SHELTON', 'FRAZIER', 'BECKER', 'MALDONADO', 'FLEMING', 'VEGA', 'SUTTON', 'COHEN', 'JENNINGS', 'PARKS', 'MCDANIEL', 'WATTS', 'BARKER', 'NORRIS', 'VAUGHN', 'VAZQUEZ', 'HOLT', 'SCHWARTZ', 'STEELE', 'BENSON', 'NEAL', 'DOMINGUEZ', 'HORTON', 'TERRY', 'WOLFE', 'HALE', 'LYONS', 'GRAVES', 'HAYNES', 'MILES', 'PARK', 'WARNER', 'PADILLA', 'BUSH', 'THORNTON', 'MCCARTHY', 'MANN', 'ZIMMERMAN', 'ERICKSON', 'FLETCHER', 'MCKINNEY', 'PAGE', 'DAWSON', 'JOSEPH', 'MARQUEZ', 'REEVES', 'KLEIN', 'ESPINOZA', 'BALDWIN', 'MORAN', 'LOVE', 'ROBBINS', 'HIGGINS', 'BALL', 'CORTEZ', 'LE', 'GRIFFITH', 'BOWEN', 'SHARP', 'CUMMINGS', 'RAMSEY', 'HARDY', 'SWANSON', 'BARBER', 'ACOSTA', 'LUNA', 'CHANDLER', 'BLAIR', 'DANIEL', 'CROSS', 'SIMON', 'DENNIS', 'OCONNOR', 'QUINN', 'GROSS', 'NAVARRO', 'MOSS', 'FITZGERALD', 'DOYLE', 'MCLAUGHLIN', 'ROJAS', 'RODGERS', 'STEVENSON', 'SINGH', 'YANG', 'FIGUEROA', 'HARMON', 'NEWTON', 'PAUL', 'MANNING', 'GARNER', 'MCGEE', 'REESE', 'FRANCIS', 'BURGESS', 'ADKINS', 'GOODMAN', 'CURRY', 'BRADY', 'CHRISTENSEN', 'POTTER', 'WALTON', 'GOODWIN', 'MULLINS', 'MOLINA', 'WEBSTER', 'FISCHER', 'CAMPOS', 'AVILA', 'SHERMAN', 'TODD', 'CHANG', 'BLAKE', 'MALONE', 'WOLF', 'HODGES', 'JUAREZ', 'GILL', 'FARMER', 'HINES', 'GALLAGHER', 'DURAN', 'HUBBARD', 'CANNON', 'MIRANDA', 'WANG', 'SAUNDERS', 'TATE', 'MACK', 'HAMMOND', 'CARRILLO', 'TOWNSEND', 'WISE', 'INGRAM', 'BARTON', 'MEJIA', 'AYALA', 'SCHROEDER', 'HAMPTON', 'ROWE', 'PARSONS', 'FRANK', 'WATERS', 'STRICKLAND', 'OSBORNE', 'MAXWELL', 'CHAN', 'DELEON', 'NORMAN', 'HARRINGTON', 'CASEY', 'PATTON', 'LOGAN', 'BOWERS', 'MUELLER', 'GLOVER', 'FLOYD', 'HARTMAN', 'BUCHANAN', 'COBB', 'FRENCH', 'KRAMER', 'MCCORMICK', 'CLARKE', 'TYLER', 'GIBBS', 'MOODY', 'CONNER', 'SPARKS', 'MCGUIRE', 'LEON', 'BAUER', 'NORTON', 'POPE', 'FLYNN', 'HOGAN', 'ROBLES', 'SALINAS', 'YATES', 'LINDSEY', 'LLOYD', 'MARSH', 'MCBRIDE', 'OWEN', 'SOLIS', 'PHAM', 'LANG', 'PRATT', 'LARA', 'BROCK', 'BALLARD', 'TRUJILLO', 'SHAFFER', 'DRAKE', 'ROMAN', 'AGUIRRE', 'MORTON', 'STOKES', 'LAMB', 'PACHECO', 'PATRICK', 'COCHRAN', 'SHEPHERD', 'CAIN', 'BURNETT', 'HESS', 'LI', 'CERVANTES', 'OLSEN', 'BRIGGS', 'OCHOA', 'CABRERA', 'VELASQUEZ', 'MONTOYA', 'ROTH', 'MEYERS', 'CARDENAS', 'FUENTES', 'WEISS', 'HOOVER', 'WILKINS', 'NICHOLSON', 'UNDERWOOD', 'SHORT', 'CARSON', 'MORROW', 'COLON', 'HOLLOWAY', 'SUMMERS', 'BRYAN', 'PETERSEN', 'MCKENZIE', 'SERRANO', 'WILCOX', 'CAREY', 'CLAYTON', 'POOLE', 'CALDERON', 'GALLEGOS', 'GREER', 'RIVAS', 'GUERRA', 'DECKER', 'COLLIER', 'WALL', 'WHITAKER', 'BASS', 'FLOWERS', 'DAVENPORT', 'CONLEY', 'HOUSTON', 'HUFF', 'COPELAND', 'HOOD', 'MONROE', 'MASSEY', 'ROBERSON', 'COMBS', 'FRANCO', 'LARSEN', 'PITTMAN', 'RANDALL', 'SKINNER', 'WILKINSON', 'KIRBY', 'CAMERON', 'BRIDGES', 'ANTHONY', 'RICHARD', 'KIRK', 'BRUCE', 'SINGLETON', 'MATHIS', 'BRADFORD', 'BOONE', 'ABBOTT', 'CHARLES', 'ALLISON', 'SWEENEY', 'ATKINSON', 'HORN', 'JEFFERSON', 'ROSALES', 'YORK', 'CHRISTIAN', 'PHELPS', 'FARRELL', 'CASTANEDA', 'NASH', 'DICKERSON', 'BOND', 'WYATT', 'FOLEY', 'CHASE', 'GATES', 'VINCENT', 'MATHEWS', 'HODGE', 'GARRISON', 'TREVINO', 'VILLARREAL', 'HEATH', 'DALTON', 'VALENCIA', 'CALLAHAN', 'HENSLEY', 'ATKINS', 'HUFFMAN', 'ROY', 'BOYER', 'SHIELDS', 'LIN', 'HANCOCK', 'GRIMES', 'GLENN', 'CLINE', 'DELACRUZ', 'CAMACHO', 'DILLON', 'PARRISH', 'ONEILL', 'MELTON', 'BOOTH', 'KANE', 'BERG', 'HARRELL', 'PITTS', 'SAVAGE', 'WIGGINS', 'BRENNAN', 'SALAS', 'MARKS', 'RUSSO', 'SAWYER', 'BAXTER', 'GOLDEN', 'HUTCHINSON', 'LIU', 'WALTER', 'MCDOWELL', 'WILEY', 'RICH', 'HUMPHREY', 'JOHNS', 'KOCH', 'SUAREZ', 'HOBBS', 'BEARD', 'GILMORE', 'IBARRA', 'KEITH', 'MACIAS', 'KHAN', 'ANDRADE', 'WARE', 'STEPHENSON', 'HENSON', 'WILKERSON', 'DYER', 'MCCLURE', 'BLACKWELL', 'MERCADO', 'TANNER', 'EATON', 'CLAY', 'BARRON', 'BEASLEY', 'ONEAL', 'PRESTON', 'SMALL', 'WU', 'ZAMORA', 'MACDONALD', 'VANCE', 'SNOW', 'MCCLAIN', 'STAFFORD', 'OROZCO', 'BARRY', 'ENGLISH', 'SHANNON', 'KLINE', 'JACOBSON', 'WOODARD', 'HUANG', 'KEMP', 'MOSLEY', 'PRINCE', 'MERRITT', 'HURST', 'VILLANUEVA', 'ROACH', 'NOLAN', 'LAM', 'YODER', 'MCCULLOUGH', 'LESTER', 'SANTANA', 'VALENZUELA', 'WINTERS', 'BARRERA', 'LEACH', 'ORR', 'BERGER', 'MCKEE', 'STRONG', 'CONWAY', 'STEIN', 'WHITEHEAD', 'BULLOCK', 'ESCOBAR', 'KNOX', 'MEADOWS', 'SOLOMON', 'VELEZ', 'ODONNELL', 'KERR', 'STOUT', 'BLANKENSHIP', 'BROWNING', 'KENT', 'LOZANO', 'BARTLETT', 'PRUITT', 'BUCK', 'BARR', 'GAINES', 'DURHAM', 'GENTRY', 'MCINTYRE', 'SLOAN', 'ROCHA', 'MELENDEZ', 'HERMAN', 'SEXTON', 'MOON', 'HENDRICKS', 'RANGEL', 'STARK', 'LOWERY', 'HARDIN', 'HULL', 'SELLERS', 'ELLISON', 'CALHOUN', 'GILLESPIE', 'MORA', 'KNAPP', 'MCCALL', 'MORSE', 'DORSEY', 'WEEKS', 'NIELSEN', 'LIVINGSTON', 'LEBLANC', 'MCLEAN', 'BRADSHAW', 'GLASS', 'MIDDLETON', 'BUCKLEY', 'SCHAEFER', 'FROST', 'HOWE', 'HOUSE', 'MCINTOSH', 'HO', 'PENNINGTON', 'REILLY', 'HEBERT', 'MCFARLAND', 'HICKMAN', 'NOBLE', 'SPEARS', 'CONRAD', 'ARIAS', 'GALVAN', 'VELAZQUEZ', 'HUYNH', 'FREDERICK', 'RANDOLPH', 'CANTU', 'FITZPATRICK', 'MAHONEY', 'PECK', 'VILLA', 'MICHAEL', 'DONOVAN', 'MCCONNELL', 'WALLS', 'BOYLE', 'MAYER', 'ZUNIGA', 'GILES', 'PINEDA', 'PACE', 'HURLEY', 'MAYS', 'MCMILLAN', 'CROSBY', 'AYERS', 'CASE', 'BENTLEY', 'SHEPARD', 'EVERETT', 'PUGH', 'DAVID', 'MCMAHON', 'DUNLAP', 'BENDER', 'HAHN', 'HARDING', 'ACEVEDO', 'RAYMOND', 'BLACKBURN', 'DUFFY', 'LANDRY', 'DOUGHERTY', 'BAUTISTA', 'SHAH', 'POTTS', 'ARROYO', 'VALENTINE', 'MEZA', 'GOULD', 'VAUGHAN', 'FRY', 'RUSH', 'AVERY', 'HERRING', 'DODSON', 'CLEMENTS', 'SAMPSON', 'TAPIA', 'BEAN', 'LYNN', 'CRANE', 'FARLEY', 'CISNEROS', 'BENTON', 'ASHLEY', 'MCKAY', 'FINLEY', 'BEST', 'BLEVINS', 'FRIEDMAN', 'MOSES', 'SOSA', 'BLANCHARD', 'HUBER', 'FRYE', 'KRUEGER', 'BERNARD', 'ROSARIO', 'RUBIO', 'MULLEN', 'BENJAMIN', 'HALEY', 'CHUNG', 'MOYER', 'CHOI', 'HORNE', 'YU', 'WOODWARD', 'ALI', 'NIXON', 'HAYDEN', 'RIVERS', 'ESTES', 'MCCARTY', 'RICHMOND', 'STUART', 'MAYNARD', 'BRANDT', 'OCONNELL', 'HANNA', 'SANFORD', 'SHEPPARD', 'CHURCH', 'BURCH', 'LEVY', 'RASMUSSEN', 'COFFEY', 'PONCE', 'FAULKNER', 'DONALDSON', 'SCHMITT', 'NOVAK', 'COSTA', 'MONTES', 'BOOKER', 'CORDOVA', 'WALLER', 'ARELLANO', 'MADDOX', 'MATA', 'BONILLA', 'STANTON', 'COMPTON', 'KAUFMAN', 'DUDLEY', 'MCPHERSON', 'BELTRAN', 'DICKSON', 'MCCANN', 'VILLEGAS', 'PROCTOR', 'HESTER', 'CANTRELL', 'DAUGHERTY', 'CHERRY', 'BRAY', 'DAVILA', 'ROWLAND', 'LEVINE', 'MADDEN', 'SPENCE', 'GOOD', 'IRWIN', 'WERNER', 'KRAUSE', 'PETTY', 'WHITNEY', 'BAIRD', 'HOOPER', 'POLLARD', 'ZAVALA', 'JARVIS', 'HOLDEN', 'HAAS', 'HENDRIX', 'MCGRATH', 'BIRD', 'LUCERO', 'TERRELL', 'RIGGS', 'JOYCE', 'MERCER', 'ROLLINS', 'GALLOWAY', 'DUKE', 'ODOM', 'ANDERSEN', 'DOWNS', 'HATFIELD', 'BENITEZ', 'ARCHER', 'HUERTA', 'TRAVIS', 'MCNEIL', 'HINTON', 'ZHANG', 'HAYS', 'MAYO', 'FRITZ', 'BRANCH', 'MOONEY', 'EWING', 'RITTER', 'ESPARZA', 'FREY', 'BRAUN', 'GAY', 'RIDDLE', 'HANEY', 'KAISER', 'HOLDER', 'CHANEY', 'MCKNIGHT', 'GAMBLE', 'VANG', 'COOLEY', 'CARNEY', 'COWAN', 'FORBES', 'FERRELL', 'DAVIES', 'BARAJAS', 'SHEA', 'OSBORN', 'BRIGHT', 'CUEVAS', 'BOLTON', 'MURILLO', 'LUTZ', 'DUARTE', 'KIDD', 'KEY', 'COOKE'];

//console.log(generate_name('eng'));


function rangen() {


for (var j = 0; j < 2000; ++j) {
//var namearr = [];

  var strU= generate_name('eng'); 
  var str = strU.toLowerCase();
if (str != null) {

//console.log(str);



var o = 1, t = 2, th = 3, f = 4, fi = 5, s = 6, se = 7, e = 8;
var obj = { 
     "b": t,
     "c": th,
     "d": f,
     "f": e,
     "g": th,
     "h": fi,
     "j": o,
     "k": t,
     "l": th,
     "m": f,
     "n": fi,
     "p": e,
     "q": o,
     "r": t,
     "s": th,
     "t": f,
     "v": s,
     "w": s,
     "x": fi,
     "z": se
};
var vocals = {
             "a": o,
             "e": fi,
             "i": o,
             "o": se,
             "u": s,
             "y": o,
             "æ": o,
             "ø": se,
             "å": o
             };


var kons = 0;
for (var e = 0; e < str.length; ++e) {

if (isNaN(obj[str[e]])) {
//console.log("nan"); continue;
}
else{
  kons = kons + obj[str[e]];
if (kons == konsGoal) {
//console.log(str + " " + kons); continue;

}// else =>if

}//else
} //for 
        //console.log("konsonant sum: " + kons);



var voc = 0;
for (var y = 0; y < str.length; ++y) {

if (isNaN(vocals[str[y]])) {
//console.log("nan"); continue;
}
else{
  voc = voc + vocals[str[y]];
if (voc == vocGoal) { 
//console.log(str + " " + voc); continue;
}// else =>if

}//else
} //for 
      //console.log("vocal sum: " + voc);


var all = kons + voc;
//console.log("all: " + all + ", kons: " + kons + ", voc: " + voc);



if (kons == konsGoal && voc == vocGoal) {

console.log(str + ", all: " + all + ", kons: " + kons + ", voc: " + voc);

//namearr.push(str, all, kons, voc);
     //console.log(namearr);


const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}




x = document.getElementById('test').innerHTML += "success!!! " + capitalize(str) + ", " + "sum: " + all + ", kons: " + kons + ", voc: " + voc + "<br>";



/*   removes all after the first one. how to make it work with no match?
if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  } //if => if
*/

} //if

//how to make it work?
/*else {
document.getElementById('test').innerHTML = "no match";
}*/



//console.log(str + ". konsonant sum: " + kons + ", vocal sum: " + voc);
}
}
} //function end


rangen();


//buttons
var btn = document.getElementById('button');
btn.onclick = function() {rangen();}

var resetbtn = document.getElementById('reset');
resetbtn.onclick = function() {
document.getElementById('test').innerHTML = "";}