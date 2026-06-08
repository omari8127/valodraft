export type EventPhase = "EARLY" | "MID" | "LATE" | "FINISH";
export type EventType =
  | "ROUND"
  | "ACE"
  | "CLUTCH"
  | "THRIFTY"
  | "FLAWLESS"
  | "MAP_POINT"
  | "MATCH_POINT"
  | "KILL"
  | "MULTI_KILL"
  | "SPIKE_PLANT"
  | "SPIKE_DEFUSE";

export const TEMPLATES = {
  EARLY: [
    "Inicio lento y metódico. {team} prioriza información y control de mapa.",
    "{player} busca el primer duelo agresivo con {agent}, marcando el ritmo.",
    "Lectura perfecta del setup defensivo por parte de {team}.",
    "{player} encuentra una apertura temprana que desestabiliza la ronda.",
    "Rotación rápida de {team} para castigar la agresión en la zona neutral.",
  ],
  MID: [
    "Mala lectura de tempo: {player} castiga la rotación enemiga.",
    "El control de {agent} en el mid-map le da a {team} una ventaja táctica inmensa.",
    "Intercambio frenético de bajas. {player} sobrevive y asegura el control del site.",
    "{team} colapsa perfectamente sobre el ejecute enemigo.",
    "Uso brillante de utilidad; {player} limpia todos los ángulos con paciencia.",
  ],
  LATE: [
    "La presión es máxima. Cada error en este retake puede costar el mapa.",
    "Situación de post-plant caótica. {player} aísla los duelos uno por uno.",
    "El tiempo se agota y {team} se ve obligado a forzar un choque frontal.",
    "{player} salva el arma en el último segundo bajo presión extrema.",
    "El eco de los disparos cesa. {team} retiene el control absoluto del punto.",
  ],
  CLUTCH: [
    "¡INCREÍBLE! {player} gana un clutch 1v2 imposible para salvar a {team}.",
    "Los nervios de acero de {player}. Un clutch monumental en el momento más crítico.",
    "Paciencia, puntería y game sense. {player} limpia a los últimos enemigos y gana la ronda.",
    "¡Nadie lo creía posible! {player} con {agent} se viste de héroe y hace el clutch.",
  ],
  FINISH: [
    "{team} encuentra el pick clave y cierra el mapa de manera contundente.",
    "¡Es todo! {player} anota la baja final y desata la celebración de {team}.",
    "Dominio táctico hasta el final. {team} asegura la victoria.",
    "Una lectura magistral en la última ronda le da a {team} el punto definitivo.",
  ],
  KILL: [
    "Apertura temprana de {player} con {agent}, dejando a {team} con ventaja.",
    "Baja seca y precisa por parte de {player}.",
    "Una kill limpia en el site le otorga el control absoluto a {team}.",
  ],
  MULTI_KILL: [
    "¡Doble y triple! {player} se enciende y limpia el camino.",
    "Espectacular multi-kill de {player} para desmantelar la defensa.",
    "Nadie puede frenar a {player}, que acumula bajas y asegura la ronda.",
  ],
  SPIKE_PLANT: [
    "Ejecución perfecta de {team}, la spike está plantada.",
    "Con la spike plantada, {team} se encierra y gana el post-plant.",
    "Rotación impecable de {team} para clavar la spike sin resistencia.",
  ],
  SPIKE_DEFUSE: [
    "Retake magistral. {player} defusa la spike bajo el humo.",
    "Tiempo límite. {team} elimina a los atacantes y desactiva la spike.",
    "Finta espectacular, {player} logra defusar la spike en el último instante.",
  ],
  ACE: [
    "¡QUÉ LOCURA! ¡{player} DESTRUYE A TODOS Y CONSIGUE EL ACE!",
    "¡ACE PARA {player}! Una demostración absoluta de superioridad mecánica.",
    "¡NO PUEDE SER! {player} barre con el equipo entero y sella la ronda con un ACE.",
  ],
};
