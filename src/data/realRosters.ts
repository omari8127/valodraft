import type { PlayerRole } from "@/types/game";

export interface RealPlayer {
  name: string;
  rating: number;
  primaryRole: PlayerRole;
  secondaryRole: PlayerRole;
  nationality: string;
}

export interface RealCoach {
  name: string;
  rating: number;
}

export interface RealRoster {
  players: RealPlayer[];
  coach: RealCoach;
}

export const REAL_ROSTERS: Record<string, Record<string, RealRoster>> = {
  "champions-2021": {
    "acend": {
      "players": [
        {
          "name": "cNed",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "zeek",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Poland",
          "image": "/jugadores/acend/zeek.png"
        },
        {
          "name": "BONECOLD",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Finland",
          "image": "/jugadores/acend/bonecold.png"
        },
        {
          "name": "Kiles",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Spain",
          "image": "/jugadores/acend/kiles.png"
        },
        {
          "name": "starxo",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Poland",
          "image": "/jugadores/acend/starxo.png"
        }
      ],
      "coach": {
        "name": "Laurance \"Nydra\" Fitz-Gerald",
        "rating": 85
      }
    },
    "envy": {
      "players": [
        {
          "name": "yay",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/yay.png"
        },
        {
          "name": "crashies",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "Marved",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/marved.png"
        },
        {
          "name": "FNS",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 88
      }
    },
    "x10": {
      "players": [
        {
          "name": "Patiphan",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/patiphan.png"
        },
        {
          "name": "foxz",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/foxz.png"
        },
        {
          "name": "Crws",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Thailand",
          "image": "/jugadores/x10/crws.png"
        },
        {
          "name": "sScary",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sscary.png"
        },
        {
          "name": "sushiboys",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sushiboys.png"
        }
      ],
      "coach": {
        "name": "Yuttanasan \"Creative\" Elizat",
        "rating": 79
      }
    },
    "keyd": {
      "players": [
        {
          "name": "heat",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/heat.png"
        },
        {
          "name": "murizzz",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/murizzz.png"
        },
        {
          "name": "v1xen",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/v1xen.png"
        },
        {
          "name": "jhow",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/jhow.png"
        },
        {
          "name": "mwzera",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/mwzera.png"
        }
      ],
      "coach": {
        "name": "Pedro \"Koy\" Pulig",
        "rating": 78
      }
    },
    "sentinels": {
      "players": [
        {
          "name": "TenZ",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Canada",
          "image": "/jugadores/sentinels/tenz.png"
        },
        {
          "name": "SicK",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/sick.png"
        },
        {
          "name": "zombs",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zombs.png"
        },
        {
          "name": "ShahZaM",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/shahzam.png"
        },
        {
          "name": "dapr",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/dapr.png"
        }
      ],
      "coach": {
        "name": "Shane \"Rawkus\" Flaherty",
        "rating": 82
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "NagZ",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        },
        {
          "name": "Mazino",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "delz1k",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/kru/delz1k.png"
        }
      ],
      "coach": {
        "name": "Rodrigo \"Onur\" Dalmagro",
        "rating": 84
      }
    },
    "tl": {
      "players": [
        {
          "name": "ScreaM",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/scream.png"
        },
        {
          "name": "Jamppi",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "L1NK",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/team liquid/l1nk.png"
        },
        {
          "name": "Nivera",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/nivera.png"
        },
        {
          "name": "soulcas",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Connor \"Sliggy\" Blomfield",
        "rating": 86
      }
    },
    "furia": {
      "players": [
        {
          "name": "qck",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/furia/qck.png"
        },
        {
          "name": "Khalil",
          "rating": 84,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "Brazil",
          "image": "/jugadores/furia/khalil.png"
        },
        {
          "name": "xand",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "Brazil",
          "image": "/jugadores/furia/xand.png"
        },
        {
          "name": "nzr",
          "rating": 81,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/furia/nzr.png"
        },
        {
          "name": "mazin",
          "rating": 82,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/furia/mazin.png"
        }
      ],
      "coach": {
        "name": "Carlos \"Carlão\" Temprano",
        "rating": 77
      }
    },
    "gambit": {
      "players": [
        {
          "name": "Sheydos",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/sheydos.png"
        },
        {
          "name": "Chronicle",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Redgar",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/redgar.png"
        },
        {
          "name": "nAts",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/nats.png"
        },
        {
          "name": "d3ffo",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/d3ffo.png"
        }
      ],
      "coach": {
        "name": "Andrey \"Engh\" Sholokhov",
        "rating": 89
      }
    },
    "vikings": {
      "players": [
        {
          "name": "frz",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/frz.png"
        },
        {
          "name": "Sacy",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "Saadhak",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        },
        {
          "name": "sutecas",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/sutecas.png"
        },
        {
          "name": "gtnziN",
          "rating": 83,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/gtnzin.png"
        }
      ],
      "coach": {
        "name": "Matheus \"bzkA\" Tarasconi",
        "rating": 81
      }
    },
    "secret": {
      "players": [
        {
          "name": "DubsteP",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Philippines",
          "image": "/jugadores/secret/dubstep.png"
        },
        {
          "name": "JessieVash",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Philippines",
          "image": "/jugadores/secret/jessievash.png"
        },
        {
          "name": "Dispenser",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Philippines",
          "image": "/jugadores/secret/dispenser.png"
        },
        {
          "name": "witz",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Philippines",
          "image": "/jugadores/secret/witz.png"
        },
        {
          "name": "BORKUM",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Philippines",
          "image": "/jugadores/secret/borkum.png"
        }
      ],
      "coach": {
        "name": "Gilbert \"Gibo\" Santos",
        "rating": 78
      }
    },
    "crazy": {
      "players": [
        {
          "name": "Munchkin",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "neth",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/crazy/neth.png"
        },
        {
          "name": "Bazzi",
          "rating": 82,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/crazy/bazzi.png"
        },
        {
          "name": "ade",
          "rating": 80,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Japan",
          "image": "/jugadores/crazy/ade.png"
        },
        {
          "name": "Fisker",
          "rating": 79,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/crazy/fisker.png"
        }
      ],
      "coach": {
        "name": "Kang \"Mun\" Geun-chul",
        "rating": 78
      }
    },
    "vs": {
      "players": [
        {
          "name": "BuZz",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "k1Ng",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/vs/k1ng.png"
        },
        {
          "name": "stax",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        },
        {
          "name": "MaKo",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        }
      ],
      "coach": {
        "name": "Pyeon \"termich\" Seon-ho",
        "rating": 85
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Magnum",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Czech Republic",
          "image": "/jugadores/fnatic/magnum.png"
        },
        {
          "name": "Boaster",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Mistic",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/mistic.png"
        },
        {
          "name": "Doma",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Croatia",
          "image": "/jugadores/fnatic/doma.png"
        }
      ],
      "coach": {
        "name": "Jacob \"mini\" Harris",
        "rating": 87
      }
    },
    "fullsense": {
      "players": [
        {
          "name": "JohnOlsen",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fullsense/johnolsen.png"
        },
        {
          "name": "PTC",
          "rating": 84,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fullsense/ptc.png"
        },
        {
          "name": "LAMMYSNAX",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fullsense/lammysnax.png"
        },
        {
          "name": "SuperBusS",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fullsense/superbuss.png"
        },
        {
          "name": "SantaGolf",
          "rating": 81,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fullsense/santagolf.png"
        }
      ],
      "coach": {
        "name": "Sitthichok \"Tong\" Liamthong",
        "rating": 76
      }
    },
    "c9": {
      "players": [
        {
          "name": "leaf",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "Xeppaa",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/xeppaa.png"
        },
        {
          "name": "vanity",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/c9/vanity.png"
        },
        {
          "name": "mitch",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/mitch.png"
        },
        {
          "name": "xeta",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/xeta.png"
        }
      ],
      "coach": {
        "name": "James \"JamezIRL\" Macaulay",
        "rating": 81
      }
    }
  },
  "champions-2022": {
    "loud": {
      "players": [
        {
          "name": "aspas",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "Less",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/loud/less.png"
        },
        {
          "name": "pancada",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/pancada.png"
        },
        {
          "name": "Sacy",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "Saadhak",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        }
      ],
      "coach": {
        "name": "Matheus \"bzkA\" Tarasconi",
        "rating": 90
      }
    },
    "optic": {
      "players": [
        {
          "name": "yay",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/yay.png"
        },
        {
          "name": "crashies",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "Marved",
          "rating": 94,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/marved.png"
        },
        {
          "name": "FNS",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 92
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "Zest",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/zest.png"
        },
        {
          "name": "MaKo",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Pyeon \"termich\" Seon-ho",
        "rating": 86
      }
    },
    "fpx": {
      "players": [
        {
          "name": "ardiis",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        },
        {
          "name": "Shao",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/shao.png"
        },
        {
          "name": "ANGE1",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Ukraine",
          "image": "/jugadores/fpx/ange1.png"
        },
        {
          "name": "Zyppan",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Sweden",
          "image": "/jugadores/fpx/zyppan.png"
        },
        {
          "name": "SUYGETSU",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/suygetsu.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 88
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Enzo",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "France",
          "image": "/jugadores/fnatic/enzo.png"
        },
        {
          "name": "Boaster",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Mistic",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/mistic.png"
        },
        {
          "name": "Alfajer",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        }
      ],
      "coach": {
        "name": "Jacob \"mini\" Harris",
        "rating": 87
      }
    },
    "xset": {
      "players": [
        {
          "name": "Cryocells",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/xset/cryocells.png"
        },
        {
          "name": "zekken",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "dephh",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/xset/dephh.png"
        },
        {
          "name": "BCJ",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/xset/bcj.png"
        },
        {
          "name": "AYRIN",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/xset/ayrin.png"
        }
      ],
      "coach": {
        "name": "Don \"SykkoNT\" Muir",
        "rating": 84
      }
    },
    "leviatan": {
      "players": [
        {
          "name": "kiNgg",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/kiNgg.png"
        },
        {
          "name": "Shyy",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/shyy.png"
        },
        {
          "name": "Mazino",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "adverso",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/adverso.png"
        },
        {
          "name": "Tacolilla",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/tacolilla.png"
        }
      ],
      "coach": {
        "name": "Rodrigo \"Onur\" Dalmagro",
        "rating": 83
      }
    },
    "tl": {
      "players": [
        {
          "name": "ScreaM",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/scream.png"
        },
        {
          "name": "Jamppi",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "L1NK",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/team liquid/l1nk.png"
        },
        {
          "name": "Nivera",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/nivera.png"
        },
        {
          "name": "soulcas",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Connor \"Sliggy\" Blomfield",
        "rating": 85
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "Benkai",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Singapore",
          "image": "/jugadores/prx/benkai.png"
        },
        {
          "name": "d4v41",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 89
      }
    },
    "zeta": {
      "players": [
        {
          "name": "Dep",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/dep.png"
        },
        {
          "name": "crow",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/crow.png"
        },
        {
          "name": "SugarZ3ro",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/zeta/sugarz3ro.png"
        },
        {
          "name": "TENNN",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Japan",
          "image": "/jugadores/zeta/tennn.png"
        },
        {
          "name": "Laz",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Japan",
          "image": "/jugadores/zeta/laz.png"
        }
      ],
      "coach": {
        "name": "Yuya \"JUNiOR\" Sawada",
        "rating": 79
      }
    },
    "100t": {
      "players": [
        {
          "name": "Asuna",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/asuna.png"
        },
        {
          "name": "bang",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/bang.png"
        },
        {
          "name": "Derrek",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/derrek.png"
        },
        {
          "name": "Will",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/will.png"
        },
        {
          "name": "stellar",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/stellar.png"
        }
      ],
      "coach": {
        "name": "Sean \"sgares\" Gares",
        "rating": 84
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Lo \"AfteR\" Hsien-lei",
        "rating": 80
      }
    }
  },
  "champions-2023": {
    "eg": {
      "players": [
        {
          "name": "Demon1",
          "rating": 98,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/eg/demon1.png"
        },
        {
          "name": "Ethan",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/ethan.png"
        },
        {
          "name": "C0M",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/eg/c0m.png"
        },
        {
          "name": "Boostio",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/eg/boostio.png"
        },
        {
          "name": "Jawgemo",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/eg/jawgemo.png"
        }
      ],
      "coach": {
        "name": "Christine \"potter\" Chi",
        "rating": 92
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "something",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 96,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 90
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Leo",
          "rating": 95,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        },
        {
          "name": "Boaster",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Alfajer",
          "rating": 96,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        },
        {
          "name": "Chronicle",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        }
      ],
      "coach": {
        "name": "Jacob \"mini\" Harris",
        "rating": 91
      }
    },
    "loud": {
      "players": [
        {
          "name": "aspas",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "cauanzin",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/loud/cauanzin.png"
        },
        {
          "name": "tuyz",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/tuyz.png"
        },
        {
          "name": "Less",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/loud/less.png"
        },
        {
          "name": "Saadhak",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        }
      ],
      "coach": {
        "name": "Daniel \"frosT\" Kaplan",
        "rating": 87
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "Zest",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/zest.png"
        },
        {
          "name": "MaKo",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Pyeon \"termich\" Seon-ho",
        "rating": 85
      }
    },
    "nrg": {
      "players": [
        {
          "name": "ardiis",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        },
        {
          "name": "crashies",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "s0m",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/nrg/s0m.png"
        },
        {
          "name": "FNS",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 88
      }
    },
    "navi": {
      "players": [
        {
          "name": "cNed",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "Shao",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/shao.png"
        },
        {
          "name": "ANGE1",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Ukraine",
          "image": "/jugadores/fpx/ange1.png"
        },
        {
          "name": "Zyppan",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Sweden",
          "image": "/jugadores/fpx/zyppan.png"
        },
        {
          "name": "SUYGETSU",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/suygetsu.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 86
      }
    },
    "tl": {
      "players": [
        {
          "name": "Sayf",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Sweden",
          "image": "/jugadores/guild/sayf.png"
        },
        {
          "name": "Jamppi",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "Redgar",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/redgar.png"
        },
        {
          "name": "nAts",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/nats.png"
        },
        {
          "name": "soulcas",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Emil \"eMIL\" Sandgren",
        "rating": 83
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Lo \"AfteR\" Hsien-lei",
        "rating": 84
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "Melser",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/melser.png"
        },
        {
          "name": "Mazino",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "NagZ",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        }
      ],
      "coach": {
        "name": "Jorge \"Atom\" Siero",
        "rating": 80
      }
    }
  },
  "champions-2024": {
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 98,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 96,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 94,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Lo \"AfteR\" Hsien-lei",
        "rating": 88
      }
    },
    "heretics": {
      "players": [
        {
          "name": "Wo0t",
          "rating": 97,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/wo0t.png"
        },
        {
          "name": "benjyfishy",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/heretics/benjyfishy.png"
        },
        {
          "name": "Boo",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/boo.png"
        },
        {
          "name": "RieNs",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/riens.png"
        },
        {
          "name": "MiniBoo",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/miniboo.png"
        }
      ],
      "coach": {
        "name": "Neil \"neilzinho\" Finlay",
        "rating": 89
      }
    },
    "leviatan": {
      "players": [
        {
          "name": "aspas",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "tex",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/leviatan/tex.png"
        },
        {
          "name": "Mazino",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "C0M",
          "rating": 91,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/eg/c0m.png"
        },
        {
          "name": "kiNgg",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/kiNgg.png"
        }
      ],
      "coach": {
        "name": "Alex \"Goked\" Herrero",
        "rating": 85
      }
    },
    "sentinels": {
      "players": [
        {
          "name": "zekken",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "Zellsis",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zellsis.png"
        },
        {
          "name": "Sacy",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "TenZ",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Canada",
          "image": "/jugadores/sentinels/tenz.png"
        },
        {
          "name": "johnqt",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Morocco",
          "image": "/jugadores/sentinels/johnqt.png"
        }
      ],
      "coach": {
        "name": "Adam \"Kaplan\" Kaplan",
        "rating": 87
      }
    },
    "geng": {
      "players": [
        {
          "name": "t3xture",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/t3xture.png"
        },
        {
          "name": "Munchkin",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "Karon",
          "rating": 93,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/karon.png"
        },
        {
          "name": "Lakia",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/lakia.png"
        },
        {
          "name": "Meteor",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/geng/meteor.png"
        }
      ],
      "coach": {
        "name": "Kang \"solo\" Keun-chul",
        "rating": 90
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Chronicle",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Boaster",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Leo",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        },
        {
          "name": "Alfajer",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        }
      ],
      "coach": {
        "name": "Jacob \"mini\" Harris",
        "rating": 88
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Flashback",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/flashback.png"
        },
        {
          "name": "BeYN",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/beyn.png"
        },
        {
          "name": "MaKo",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Pyeon \"termich\" Seon-ho",
        "rating": 84
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "something",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 96,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 86
      }
    },
    "g2": {
      "players": [
        {
          "name": "leaf",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "trent",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/trent.png"
        },
        {
          "name": "valyn",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/g2/valyn.png"
        },
        {
          "name": "icy",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/icy.png"
        },
        {
          "name": "JonahP",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/g2/jonahp.png"
        }
      ],
      "coach": {
        "name": "Josh \"JoshRT\" Lee",
        "rating": 85
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "Melser",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/melser.png"
        },
        {
          "name": "Shyy",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/shyy.png"
        },
        {
          "name": "mta",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/kru/mta.png"
        },
        {
          "name": "heat",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/heat.png"
        }
      ],
      "coach": {
        "name": "Jorge \"Atom\" Siero",
        "rating": 81
      }
    },
    "vitality": {
      "players": [
        {
          "name": "Sayf",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Sweden",
          "image": "/jugadores/guild/sayf.png"
        },
        {
          "name": "trexx",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/vitality/trexx.png"
        },
        {
          "name": "Kicks",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Finland",
          "image": "/jugadores/vitality/kicks.png"
        },
        {
          "name": "ceNder",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Lithuania",
          "image": "/jugadores/vitality/cender.png"
        },
        {
          "name": "runneR",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/giantx/runneR.png"
        }
      ],
      "coach": {
        "name": "Harry \"Gorilla\" Mepham",
        "rating": 81
      }
    },
    "talon": {
      "players": [
        {
          "name": "primmie",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Thailand",
          "image": "/jugadores/talon/primmie.png"
        },
        {
          "name": "Crws",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Thailand",
          "image": "/jugadores/x10/crws.png"
        },
        {
          "name": "Governor",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/talon/governor.png"
        },
        {
          "name": "ban",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/t1/ban.png"
        },
        {
          "name": "JitBoyS",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Thailand",
          "image": "/jugadores/talon/jitboys.png"
        }
      ],
      "coach": {
        "name": "Hector \"FrosT\" Rosario",
        "rating": 80
      }
    },
    "fut": {
      "players": [
        {
          "name": "cNed",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "yetujey",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/yetujey.png"
        },
        {
          "name": "MrFaliN",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Turkey",
          "image": "/jugadores/fut/MrFaliN.png"
        },
        {
          "name": "xeus",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/xeus.png"
        },
        {
          "name": "AtaKaptan",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/atakaptan.png"
        }
      ],
      "coach": {
        "name": "Eray \"Gais\" Sarıkaya",
        "rating": 82
      }
    },
    "blg": {
      "players": [
        {
          "name": "whzy",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/whzy.png"
        },
        {
          "name": "Knight",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/knight.png"
        },
        {
          "name": "nephh",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/nephh.png"
        },
        {
          "name": "Levius",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/levius.png"
        },
        {
          "name": "rushia",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/rushia.png"
        }
      ],
      "coach": {
        "name": "Wang \"jeXeN\" Xiao-xiao",
        "rating": 79
      }
    },
    "trace": {
      "players": [
        {
          "name": "Kai",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/trace/kai.png"
        },
        {
          "name": "FengF",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/trace/fengf.png"
        },
        {
          "name": "HeiB",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/trace/heib.png"
        },
        {
          "name": "Biank",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/trace/biank.png"
        },
        {
          "name": "LuoK1ng",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/trace/luok1ng.png"
        }
      ],
      "coach": {
        "name": "Feng \"Yoona\" Nelson",
        "rating": 80
      }
    }
  },
  "champions-2025": {
    "nrg": {
      "players": [
        {
          "name": "brawk",
          "rating": 98,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/brawk.png"
        },
        {
          "name": "mada",
          "rating": 96,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/mada.png"
        },
        {
          "name": "s0m",
          "rating": 94,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/nrg/s0m.png"
        },
        {
          "name": "skuba",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/skuba.png"
        },
        {
          "name": "Ethan",
          "rating": 95,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/ethan.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 86
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Alfajer",
          "rating": 97,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        },
        {
          "name": "Chronicle",
          "rating": 96,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Boaster",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "crashies",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "kaajak",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Czech Republic",
          "image": "/jugadores/fnatic/kaajak.png"
        }
      ],
      "coach": {
        "name": "Jacob \"mini\" Harris",
        "rating": 88
      }
    },
    "drx": {
      "players": [
        {
          "name": "HYUNMIN",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/hyunmin.png"
        },
        {
          "name": "free1ng",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/free1ng.png"
        },
        {
          "name": "BeYN",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/beyn.png"
        },
        {
          "name": "MaKo",
          "rating": 96,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "Flashback",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/flashback.png"
        }
      ],
      "coach": {
        "name": "Pyeon \"termich\" Seon-ho",
        "rating": 84
      }
    },
    "prx": {
      "players": [
        {
          "name": "f0rsakeN",
          "rating": 97,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "something",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "mindfreak",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        },
        {
          "name": "Jinggg",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 87
      }
    },
    "heretics": {
      "players": [
        {
          "name": "Wo0t",
          "rating": 96,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/wo0t.png"
        },
        {
          "name": "benjyfishy",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/heretics/benjyfishy.png"
        },
        {
          "name": "Boo",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/boo.png"
        },
        {
          "name": "RieNs",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/riens.png"
        },
        {
          "name": "MiniBoo",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/miniboo.png"
        }
      ],
      "coach": {
        "name": "Neil \"neilzinho\" Finlay",
        "rating": 89
      }
    },
    "mibr": {
      "players": [
        {
          "name": "artzin",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/mibr/artzin.png"
        },
        {
          "name": "cortezia",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/mibr/cortezia.png"
        },
        {
          "name": "xenom",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/mibr/xenom.png"
        },
        {
          "name": "Verno",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/mibr/verno.png"
        },
        {
          "name": "aspas",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        }
      ],
      "coach": {
        "name": "Daniel \"frosT\" Kaplan",
        "rating": 80
      }
    },
    "giantx": {
      "players": [
        {
          "name": "Cloud",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/giantx/cloud.png"
        },
        {
          "name": "westside",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/giantx/westside.png"
        },
        {
          "name": "runneR",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/giantx/runneR.png"
        },
        {
          "name": "nukkye",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Lithuania",
          "image": "/jugadores/g2/nukkye.png"
        },
        {
          "name": "Purp0",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/giantx/purp0.png"
        }
      ],
      "coach": {
        "name": "Daniil \"Pipson\" Mesheryakov",
        "rating": 81
      }
    },
    "g2": {
      "players": [
        {
          "name": "leaf",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "trent",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/trent.png"
        },
        {
          "name": "valyn",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/g2/valyn.png"
        },
        {
          "name": "icy",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/icy.png"
        },
        {
          "name": "JonahP",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/g2/jonahp.png"
        }
      ],
      "coach": {
        "name": "Josh \"JoshRT\" Lee",
        "rating": 85
      }
    },
    "tl": {
      "players": [
        {
          "name": "Keiko",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/tl/keiko.png"
        },
        {
          "name": "Serial",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Germany",
          "image": "/jugadores/tl/serial.png"
        },
        {
          "name": "paTiTek",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Poland",
          "image": "/jugadores/tl/patitek.png"
        },
        {
          "name": "nAts",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/nats.png"
        },
        {
          "name": "kamo",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Poland",
          "image": "/jugadores/tl/kamo.png"
        }
      ],
      "coach": {
        "name": "Emil \"eMIL\" Sandgren",
        "rating": 83
      }
    },
    "t1": {
      "players": [
        {
          "name": "BuZz",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Sylvan",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/t1/sylvan.png"
        },
        {
          "name": "carpe",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/t1/carpe.png"
        },
        {
          "name": "stax",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        },
        {
          "name": "Meteor",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/geng/meteor.png"
        }
      ],
      "coach": {
        "name": "Yoon \"Autumn\" Eu-teum",
        "rating": 81
      }
    },
    "rrq": {
      "players": [
        {
          "name": "Jemkin",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/jemkin.png"
        },
        {
          "name": "Monyet",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/monyet.png"
        },
        {
          "name": "xffero",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/xffero.png"
        },
        {
          "name": "Kushy",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/kushy.png"
        },
        {
          "name": "Estrella",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/estrella.png"
        }
      ],
      "coach": {
        "name": "Marthinus \"Ewok\" Walt",
        "rating": 80
      }
    },
    "blg": {
      "players": [
        {
          "name": "whzy",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/whzy.png"
        },
        {
          "name": "Knight",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/knight.png"
        },
        {
          "name": "nephh",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/nephh.png"
        },
        {
          "name": "Levius",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/levius.png"
        },
        {
          "name": "rushia",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/blg/rushia.png"
        }
      ],
      "coach": {
        "name": "Wang \"jeXeN\" Xiao-xiao",
        "rating": 81
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Lo \"AfteR\" Hsien-lei",
        "rating": 85
      }
    },
    "xlg": {
      "players": [
        {
          "name": "Rarga",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/rarga.png"
        },
        {
          "name": "happywei",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/happywei.png"
        },
        {
          "name": "Viva",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/viva.png"
        },
        {
          "name": "Midi",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/midi.png"
        },
        {
          "name": "coconut",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/coconut.png"
        }
      ],
      "coach": {
        "name": "Sun \"Trainer\" Hao",
        "rating": 80
      }
    },
    "drg": {
      "players": [
        {
          "name": "Nicc",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/drg/nicc.png"
        },
        {
          "name": "SpiritZ1",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/drg/spiritz1.png"
        },
        {
          "name": "LanLan",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/drg/lanlan.png"
        },
        {
          "name": "Wenzzz",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/drg/wenzzz.png"
        },
        {
          "name": "CZD",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/drg/czd.png"
        }
      ],
      "coach": {
        "name": "Li \"Coach\" Xiaoming",
        "rating": 79
      }
    },
    "sentinels": {
      "players": [
        {
          "name": "zekken",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "N4RRATE",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/n4rrate.png"
        },
        {
          "name": "bang",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/bang.png"
        },
        {
          "name": "johnqt",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Morocco",
          "image": "/jugadores/sentinels/johnqt.png"
        },
        {
          "name": "Zellsis",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zellsis.png"
        }
      ],
      "coach": {
        "name": "Adam \"Kaplan\" Kaplan",
        "rating": 87
      }
    }
  },
  "masters-reykjavik-2021": {
    "sentinels": {
      "players": [
        {
          "name": "TenZ",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Canada",
          "image": "/jugadores/sentinels/tenz.png"
        },
        {
          "name": "SicK",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/sick.png"
        },
        {
          "name": "zombs",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zombs.png"
        },
        {
          "name": "ShahZaM",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/shahzam.png"
        },
        {
          "name": "dapr",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/dapr.png"
        }
      ],
      "coach": {
        "name": "Jay \"sinatraa\" Won",
        "rating": 79
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Magnum",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Czech Republic",
          "image": "/jugadores/fnatic/magnum.png"
        },
        {
          "name": "Boaster",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Mistic",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/mistic.png"
        },
        {
          "name": "Doma",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Croatia",
          "image": "/jugadores/fnatic/doma.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 81
      }
    },
    "tl": {
      "players": [
        {
          "name": "ScreaM",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/scream.png"
        },
        {
          "name": "Jamppi",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "L1NK",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/team liquid/l1nk.png"
        },
        {
          "name": "Nivera",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/nivera.png"
        },
        {
          "name": "soulcas",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Stefan \"Kassad\" Tcherepanov",
        "rating": 85
      }
    },
    "version1": {
      "players": [
        {
          "name": "pennpenn",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/version1/pennpenn.png"
        },
        {
          "name": "Zellsis",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zellsis.png"
        },
        {
          "name": "effys",
          "rating": 82,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/version1/effys.png"
        },
        {
          "name": "wippie",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/version1/wippie.png"
        },
        {
          "name": "Vanity",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/c9/vanity.png"
        }
      ],
      "coach": {
        "name": "Adam \"Kaplan\" Kaplan",
        "rating": 78
      }
    },
    "nuturn": {
      "players": [
        {
          "name": "Suggest",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/nuturn/suggest.png"
        },
        {
          "name": "solo",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/nuturn/solo.png"
        },
        {
          "name": "Autumn",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/nuturn/autumn.png"
        },
        {
          "name": "Lakia",
          "rating": 84,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/lakia.png"
        },
        {
          "name": "BuZz",
          "rating": 86,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        }
      ],
      "coach": {
        "name": "Kim \"Coach K\" Sang-kyu",
        "rating": 80
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "NagZ",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        },
        {
          "name": "Mazino",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "delz1k",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/kru/delz1k.png"
        }
      ],
      "coach": {
        "name": "Joaquin \"Gosen\" Mach",
        "rating": 79
      }
    },
    "sharks": {
      "players": [
        {
          "name": "qck",
          "rating": 81,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/furia/qck.png"
        },
        {
          "name": "Khalil",
          "rating": 80,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "Brazil",
          "image": "/jugadores/furia/khalil.png"
        },
        {
          "name": "xand",
          "rating": 80,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "Brazil",
          "image": "/jugadores/furia/xand.png"
        },
        {
          "name": "nzr",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/furia/nzr.png"
        },
        {
          "name": "mazin",
          "rating": 79,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/furia/mazin.png"
        }
      ],
      "coach": {
        "name": "Thiago \"Tnzs\" Nunes",
        "rating": 74
      }
    },
    "vikings": {
      "players": [
        {
          "name": "frz",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/frz.png"
        },
        {
          "name": "Sacy",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "Saadhak",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        },
        {
          "name": "sutecas",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/sutecas.png"
        },
        {
          "name": "gtnziN",
          "rating": 81,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Brazil",
          "image": "/jugadores/vikings/gtnzin.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"xand\" Zizi",
        "rating": 75
      }
    },
    "x10": {
      "players": [
        {
          "name": "Patiphan",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/patiphan.png"
        },
        {
          "name": "foxz",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/foxz.png"
        },
        {
          "name": "Crws",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Thailand",
          "image": "/jugadores/x10/crws.png"
        },
        {
          "name": "sScary",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sscary.png"
        },
        {
          "name": "sushiboys",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sushiboys.png"
        }
      ],
      "coach": {
        "name": "Sheen",
        "rating": 77
      }
    },
    "crazy": {
      "players": [
        {
          "name": "Munchkin",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "neth",
          "rating": 81,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/crazy/neth.png"
        },
        {
          "name": "Bazzi",
          "rating": 80,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/crazy/bazzi.png"
        },
        {
          "name": "ade",
          "rating": 78,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Japan",
          "image": "/jugadores/crazy/ade.png"
        },
        {
          "name": "Fisker",
          "rating": 77,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/crazy/fisker.png"
        }
      ],
      "coach": {
        "name": "Yusuke \"YukaF\" Fujita",
        "rating": 74
      }
    }
  },
  "masters-berlin-2021": {
    "gambit": {
      "players": [
        {
          "name": "Sheydos",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/sheydos.png"
        },
        {
          "name": "Chronicle",
          "rating": 92,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Redgar",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/redgar.png"
        },
        {
          "name": "nAts",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/nats.png"
        },
        {
          "name": "d3ffo",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/d3ffo.png"
        }
      ],
      "coach": {
        "name": "Dmitry \"jett\" Lushkin",
        "rating": 85
      }
    },
    "envy": {
      "players": [
        {
          "name": "yay",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/yay.png"
        },
        {
          "name": "crashies",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "Marved",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/marved.png"
        },
        {
          "name": "FNS",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 87
      }
    },
    "g2": {
      "players": [
        {
          "name": "nukkye",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Lithuania",
          "image": "/jugadores/g2/nukkye.png"
        },
        {
          "name": "hoody",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/hoody.png"
        },
        {
          "name": "pAura",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/paura.png"
        },
        {
          "name": "Meddo",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/meddo.png"
        },
        {
          "name": "ardiis",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 80
      }
    },
    "vs": {
      "players": [
        {
          "name": "BuZz",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "k1Ng",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/vs/k1ng.png"
        },
        {
          "name": "stax",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        },
        {
          "name": "MaKo",
          "rating": 88,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        }
      ],
      "coach": {
        "name": "Park \"Autumn\" Gyeong-jun",
        "rating": 83
      }
    },
    "acend": {
      "players": [
        {
          "name": "cNed",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "zeek",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Poland",
          "image": "/jugadores/acend/zeek.png"
        },
        {
          "name": "BONECOLD",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Finland",
          "image": "/jugadores/acend/bonecold.png"
        },
        {
          "name": "Kiles",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Spain",
          "image": "/jugadores/acend/kiles.png"
        },
        {
          "name": "starxo",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Poland",
          "image": "/jugadores/acend/starxo.png"
        }
      ],
      "coach": {
        "name": "Karel \"Karelvh\" van Hoof",
        "rating": 80
      }
    },
    "sentinels": {
      "players": [
        {
          "name": "TenZ",
          "rating": 92,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Canada",
          "image": "/jugadores/sentinels/tenz.png"
        },
        {
          "name": "SicK",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/sick.png"
        },
        {
          "name": "zombs",
          "rating": 81,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zombs.png"
        },
        {
          "name": "ShahZaM",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/shahzam.png"
        },
        {
          "name": "dapr",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/dapr.png"
        }
      ],
      "coach": {
        "name": "Jay \"sinatraa\" Won",
        "rating": 99
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "NagZ",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        },
        {
          "name": "Mazino",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "delz1k",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/kru/delz1k.png"
        }
      ],
      "coach": {
        "name": "Joaquin \"Gosen\" Mach",
        "rating": 79
      }
    },
    "smb": {
      "players": [
        {
          "name": "Turko",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/turko.png"
        },
        {
          "name": "Izzy",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/izzy.png"
        },
        {
          "name": "Brave",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/brave.png"
        },
        {
          "name": "Szejn",
          "rating": 81,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/szejn.png"
        },
        {
          "name": "MOJJ",
          "rating": 80,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/mojj.png"
        }
      ],
      "coach": {
        "name": "Mert \"Tankut\" Tankut",
        "rating": 76
      }
    },
    "100t": {
      "players": [
        {
          "name": "Asuna",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/asuna.png"
        },
        {
          "name": "Ethan",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/ethan.png"
        },
        {
          "name": "bang",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/bang.png"
        },
        {
          "name": "Hiko",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/hiko.png"
        },
        {
          "name": "steel",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/steel.png"
        }
      ],
      "coach": {
        "name": "Sean \"sgares\" Gares",
        "rating": 80
      }
    },
    "f4q": {
      "players": [
        {
          "name": "Bunny",
          "rating": 83,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/f4q/bunny.png"
        },
        {
          "name": "FiveK",
          "rating": 80,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/f4q/fivek.png"
        },
        {
          "name": "Zunba",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/f4q/zunba.png"
        },
        {
          "name": "Esperanza",
          "rating": 81,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/f4q/esperanza.png"
        },
        {
          "name": "Efina",
          "rating": 80,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/f4q/efina.png"
        }
      ],
      "coach": {
        "name": "Yoo \"Locomotive\" Chae-hwan",
        "rating": 78
      }
    },
    "liberty": {
      "players": [
        {
          "name": "liazzi",
          "rating": 80,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/liberty/liazzi.png"
        },
        {
          "name": "krain",
          "rating": 81,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/liberty/krain.png"
        },
        {
          "name": "pleets",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/liberty/pleets.png"
        },
        {
          "name": "shion",
          "rating": 80,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/liberty/shion.png"
        },
        {
          "name": "mysen",
          "rating": 79,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/liberty/mysen.png"
        }
      ],
      "coach": {
        "name": "Ricardo \"rik\" Sobral",
        "rating": 77
      }
    },
    "keyd": {
      "players": [
        {
          "name": "heat",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/heat.png"
        },
        {
          "name": "murizzz",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/murizzz.png"
        },
        {
          "name": "v1xen",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/v1xen.png"
        },
        {
          "name": "jhow",
          "rating": 81,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/jhow.png"
        },
        {
          "name": "mwzera",
          "rating": 86,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/keydstars/mwzera.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"Nado\" Fernandes",
        "rating": 76
      }
    }
  },
  "masters-reykjavik-2022": {
    "optic": {
      "players": [
        {
          "name": "yay",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/yay.png"
        },
        {
          "name": "crashies",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "Marved",
          "rating": 93,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/marved.png"
        },
        {
          "name": "FNS",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 88
      }
    },
    "loud": {
      "players": [
        {
          "name": "aspas",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "Less",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/loud/less.png"
        },
        {
          "name": "pancada",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/pancada.png"
        },
        {
          "name": "Sacy",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "Saadhak",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        }
      ],
      "coach": {
        "name": "Matheus \"bzkA\" Tarasconi",
        "rating": 88
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "Zest",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/zest.png"
        },
        {
          "name": "MaKo",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Kim \"termi\" Kyung-min",
        "rating": 86
      }
    },
    "zeta": {
      "players": [
        {
          "name": "Laz",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Japan",
          "image": "/jugadores/zeta/laz.png"
        },
        {
          "name": "crow",
          "rating": 84,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/crow.png"
        },
        {
          "name": "SugarZ3ro",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/zeta/sugarz3ro.png"
        },
        {
          "name": "TENNN",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Japan",
          "image": "/jugadores/zeta/tennn.png"
        },
        {
          "name": "Dep",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/dep.png"
        }
      ],
      "coach": {
        "name": "Manabu \"Manabu\" Iwata",
        "rating": 79
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Enzo",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "France",
          "image": "/jugadores/fnatic/enzo.png"
        },
        {
          "name": "Boaster",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Mistic",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/mistic.png"
        },
        {
          "name": "Alfajer",
          "rating": 91,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 83
      }
    },
    "tl": {
      "players": [
        {
          "name": "ScreaM",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/scream.png"
        },
        {
          "name": "Jamppi",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "L1NK",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/team liquid/l1nk.png"
        },
        {
          "name": "Nivera",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Belgium",
          "image": "/jugadores/team liquid/nivera.png"
        },
        {
          "name": "soulcas",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Stefan \"Kassad\" Tcherepanov",
        "rating": 86
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "NagZ",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        },
        {
          "name": "Mazino",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "delz1k",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/kru/delz1k.png"
        }
      ],
      "coach": {
        "name": "Joaquin \"Gosen\" Mach",
        "rating": 80
      }
    },
    "xerxia": {
      "players": [
        {
          "name": "Patiphan",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/patiphan.png"
        },
        {
          "name": "sushiboys",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sushiboys.png"
        },
        {
          "name": "Crws",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Thailand",
          "image": "/jugadores/x10/crws.png"
        },
        {
          "name": "sScary",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/sscary.png"
        },
        {
          "name": "foxz",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/x10/foxz.png"
        }
      ],
      "coach": {
        "name": "Sheen",
        "rating": 77
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "Benkai",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Singapore",
          "image": "/jugadores/prx/benkai.png"
        },
        {
          "name": "d4v41",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 91,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 84
      }
    },
    "nip": {
      "players": [
        {
          "name": "Joose",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nip/joose.png"
        },
        {
          "name": "Patitek",
          "rating": 83,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Poland",
          "image": "/jugadores/tl/patitek.png"
        },
        {
          "name": "LNATION",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nip/lnation.png"
        },
        {
          "name": "FASHR",
          "rating": 81,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nip/fashr.png"
        },
        {
          "name": "zeek",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Poland",
          "image": "/jugadores/acend/zeek.png"
        }
      ],
      "coach": {
        "name": "Sami \"zid\" Laasanen",
        "rating": 77
      }
    },
    "guard": {
      "players": [
        {
          "name": "leaf",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "trent",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/trent.png"
        },
        {
          "name": "valyn",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/g2/valyn.png"
        },
        {
          "name": "icy",
          "rating": 83,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/icy.png"
        },
        {
          "name": "JonahP",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/g2/jonahp.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 79
      }
    },
    "guild": {
      "players": [
        {
          "name": "Sayf",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Sweden",
          "image": "/jugadores/guild/sayf.png"
        },
        {
          "name": "Dreamas",
          "rating": 84,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/guild/dreamas.png"
        },
        {
          "name": "Ro4r",
          "rating": 82,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/guild/ro4r.png"
        },
        {
          "name": "Kiles",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Spain",
          "image": "/jugadores/acend/kiles.png"
        },
        {
          "name": "Leo",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        }
      ],
      "coach": {
        "name": "David \"Dreamas\" Batard",
        "rating": 78
      }
    }
  },
  "masters-copenhagen-2022": {
    "fpx": {
      "players": [
        {
          "name": "ardiis",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        },
        {
          "name": "Shao",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/shao.png"
        },
        {
          "name": "ANGE1",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Ukraine",
          "image": "/jugadores/fpx/ange1.png"
        },
        {
          "name": "Zyppan",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Sweden",
          "image": "/jugadores/fpx/zyppan.png"
        },
        {
          "name": "SUYGETSU",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/suygetsu.png"
        }
      ],
      "coach": {
        "name": "Jakob \"Remmey\" Hansen",
        "rating": 84
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "Benkai",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Singapore",
          "image": "/jugadores/prx/benkai.png"
        },
        {
          "name": "d4v41",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 85
      }
    },
    "optic": {
      "players": [
        {
          "name": "yay",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/yay.png"
        },
        {
          "name": "crashies",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "Marved",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/marved.png"
        },
        {
          "name": "FNS",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 87
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Enzo",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "France",
          "image": "/jugadores/fnatic/enzo.png"
        },
        {
          "name": "Boaster",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Mistic",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/mistic.png"
        },
        {
          "name": "Alfajer",
          "rating": 91,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 83
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "Zest",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/zest.png"
        },
        {
          "name": "MaKo",
          "rating": 92,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Kim \"termi\" Kyung-min",
        "rating": 85
      }
    },
    "guild": {
      "players": [
        {
          "name": "Sayf",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Sweden",
          "image": "/jugadores/guild/sayf.png"
        },
        {
          "name": "Dreamas",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/guild/dreamas.png"
        },
        {
          "name": "Ro4r",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/guild/ro4r.png"
        },
        {
          "name": "Kiles",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Spain",
          "image": "/jugadores/acend/kiles.png"
        },
        {
          "name": "Leo",
          "rating": 86,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        }
      ],
      "coach": {
        "name": "David \"Dreamas\" Batard",
        "rating": 79
      }
    },
    "xset": {
      "players": [
        {
          "name": "Cryocells",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/xset/cryocells.png"
        },
        {
          "name": "zekken",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "dephh",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "UK",
          "image": "/jugadores/xset/dephh.png"
        },
        {
          "name": "BCJ",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/xset/bcj.png"
        },
        {
          "name": "AYRIN",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/xset/ayrin.png"
        }
      ],
      "coach": {
        "name": "Jeffrey \"frosty\" Colon",
        "rating": 81
      }
    },
    "kru": {
      "players": [
        {
          "name": "keznit",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/keznit.png"
        },
        {
          "name": "NagZ",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/kru/nagz.png"
        },
        {
          "name": "Mazino",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "Klaus",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/kru/klaus.png"
        },
        {
          "name": "delz1k",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/kru/delz1k.png"
        }
      ],
      "coach": {
        "name": "Joaquin \"Gosen\" Mach",
        "rating": 80
      }
    },
    "leviatan": {
      "players": [
        {
          "name": "Tacolilla",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/tacolilla.png"
        },
        {
          "name": "Shyy",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/shyy.png"
        },
        {
          "name": "Melser",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/melser.png"
        },
        {
          "name": "adverso",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/adverso.png"
        },
        {
          "name": "KiNgg",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/leviatan/kiNgg.png"
        }
      ],
      "coach": {
        "name": "Rodrigo \"Onur\" Dalmagro",
        "rating": 83
      }
    },
    "northeption": {
      "players": [
        {
          "name": "Dep",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/dep.png"
        },
        {
          "name": "crow",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Japan",
          "image": "/jugadores/zeta/crow.png"
        },
        {
          "name": "SugarZ3ro",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/zeta/sugarz3ro.png"
        },
        {
          "name": "TENNN",
          "rating": 83,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Japan",
          "image": "/jugadores/zeta/tennn.png"
        },
        {
          "name": "Laz",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Japan",
          "image": "/jugadores/zeta/laz.png"
        }
      ],
      "coach": {
        "name": "Manabu \"Manabu\" Iwata",
        "rating": 78
      }
    }
  },
  "masters-tokyo-2023": {
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Leo",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        },
        {
          "name": "Boaster",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Alfajer",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        },
        {
          "name": "Chronicle",
          "rating": 92,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 85
      }
    },
    "eg": {
      "players": [
        {
          "name": "Demon1",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/eg/demon1.png"
        },
        {
          "name": "Jawgemo",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/eg/jawgemo.png"
        },
        {
          "name": "C0M",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/eg/c0m.png"
        },
        {
          "name": "Boostio",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/eg/boostio.png"
        },
        {
          "name": "Ethan",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/ethan.png"
        }
      ],
      "coach": {
        "name": "Damien \"miniice\" Rustom",
        "rating": 86
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "something",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 86
      }
    },
    "nrg": {
      "players": [
        {
          "name": "ardiis",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        },
        {
          "name": "crashies",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "s0m",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/nrg/s0m.png"
        },
        {
          "name": "FNS",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Canada",
          "image": "/jugadores/envy/fns.png"
        },
        {
          "name": "Victor",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/envy/victor.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 87
      }
    },
    "tl": {
      "players": [
        {
          "name": "Sayf",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Sweden",
          "image": "/jugadores/guild/sayf.png"
        },
        {
          "name": "Jamppi",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "DUELIST",
          "nationality": "Finland",
          "image": "/jugadores/team liquid/jamppi.png"
        },
        {
          "name": "Redgar",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/gambit/redgar.png"
        },
        {
          "name": "nAts",
          "rating": 91,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/gambit/nats.png"
        },
        {
          "name": "soulcas",
          "rating": 86,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/team liquid/soulcas.png"
        }
      ],
      "coach": {
        "name": "Stefan \"Kassad\" Tcherepanov",
        "rating": 85
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Rb",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "South Korea",
          "image": "/jugadores/drx/rb.png"
        },
        {
          "name": "Zest",
          "rating": 85,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/zest.png"
        },
        {
          "name": "MaKo",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Kim \"termi\" Kyung-min",
        "rating": 86
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Guo \"seven\" Qi",
        "rating": 80
      }
    },
    "t1": {
      "players": [
        {
          "name": "Sayaplayer",
          "rating": 86,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/t1/sayaplayer.png"
        },
        {
          "name": "Carpe",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/t1/carpe.png"
        },
        {
          "name": "ban",
          "rating": 81,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/t1/ban.png"
        },
        {
          "name": "Munchkin",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "xeta",
          "rating": 84,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/c9/xeta.png"
        }
      ],
      "coach": {
        "name": "Yoon \"Autumn\" Eu-teum",
        "rating": 81
      }
    },
    "fut": {
      "players": [
        {
          "name": "qw1",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/qw1.png"
        },
        {
          "name": "qRaxs",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/qraxs.png"
        },
        {
          "name": "MrFaliN",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Turkey",
          "image": "/jugadores/fut/MrFaliN.png"
        },
        {
          "name": "MOJJ",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/smb/mojj.png"
        },
        {
          "name": "AtaKaptan",
          "rating": 83,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/atakaptan.png"
        }
      ],
      "coach": {
        "name": "Eray \"Gais\" Sarıkaya",
        "rating": 82
      }
    },
    "navi": {
      "players": [
        {
          "name": "cNed",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "Shao",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/shao.png"
        },
        {
          "name": "ANGE1",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Ukraine",
          "image": "/jugadores/fpx/ange1.png"
        },
        {
          "name": "Zyppan",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Sweden",
          "image": "/jugadores/fpx/zyppan.png"
        },
        {
          "name": "SUYGETSU",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/suygetsu.png"
        }
      ],
      "coach": {
        "name": "Svyatoslav \"Bagz\" Bagautdinov",
        "rating": 82
      }
    },
    "ase": {
      "players": [
        {
          "name": "Sya1ns",
          "rating": 82,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/ase/sya1ns.png"
        },
        {
          "name": "Keiko",
          "rating": 81,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/tl/keiko.png"
        },
        {
          "name": "Astell",
          "rating": 79,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/ase/astell.png"
        },
        {
          "name": "Crow",
          "rating": 78,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Japan",
          "image": "/jugadores/zeta/crow.png"
        },
        {
          "name": "Minty",
          "rating": 80,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/ase/minty.png"
        }
      ],
      "coach": {
        "name": "Lee \"Coach\" Sung-jin",
        "rating": 72
      }
    }
  },
  "masters-madrid-2024": {
    "sentinels": {
      "players": [
        {
          "name": "zekken",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "Zellsis",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zellsis.png"
        },
        {
          "name": "Sacy",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/sacy.png"
        },
        {
          "name": "TenZ",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Canada",
          "image": "/jugadores/sentinels/tenz.png"
        },
        {
          "name": "johnqt",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Morocco",
          "image": "/jugadores/sentinels/johnqt.png"
        }
      ],
      "coach": {
        "name": "Adam \"Kaplan\" Kaplan",
        "rating": 82
      }
    },
    "geng": {
      "players": [
        {
          "name": "t3xture",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/t3xture.png"
        },
        {
          "name": "Munchkin",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "Karon",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/karon.png"
        },
        {
          "name": "Lakia",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/lakia.png"
        },
        {
          "name": "Meteor",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/geng/meteor.png"
        }
      ],
      "coach": {
        "name": "Park \"Autumn\" Gyeong-jun",
        "rating": 86
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "something",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 86
      }
    },
    "karmine": {
      "players": [
        {
          "name": "marteen",
          "rating": 84,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Czech Republic",
          "image": "/jugadores/karmine/marteen.png"
        },
        {
          "name": "Shin",
          "rating": 83,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "France",
          "image": "/jugadores/karmine/shin.png"
        },
        {
          "name": "tomaszy",
          "rating": 84,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "Portugal",
          "image": "/jugadores/karmine/tomaszy.png"
        },
        {
          "name": "magnum",
          "rating": 83,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/fnatic/magnum.png"
        },
        {
          "name": "vladeN",
          "rating": 82,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "France",
          "image": "/jugadores/karmine/vladen.png"
        }
      ],
      "coach": {
        "name": "Arthur \"pm\" Guillermet",
        "rating": 82
      }
    },
    "loud": {
      "players": [
        {
          "name": "aspas",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "Less",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "Brazil",
          "image": "/jugadores/loud/less.png"
        },
        {
          "name": "tuyz",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "Brazil",
          "image": "/jugadores/loud/tuyz.png"
        },
        {
          "name": "Saadhak",
          "rating": 92,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Argentina",
          "image": "/jugadores/loud/saadhak.png"
        },
        {
          "name": "cauanzin",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/loud/cauanzin.png"
        }
      ],
      "coach": {
        "name": "Matheus \"bzkA\" Tarasconi",
        "rating": 87
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 89,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Guo \"seven\" Qi",
        "rating": 81
      }
    },
    "heretics": {
      "players": [
        {
          "name": "Wo0t",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/wo0t.png"
        },
        {
          "name": "benjyfishy",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/heretics/benjyfishy.png"
        },
        {
          "name": "Boo",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/boo.png"
        },
        {
          "name": "RieNs",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/riens.png"
        },
        {
          "name": "MiniBoo",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/miniboo.png"
        }
      ],
      "coach": {
        "name": "Nuno \"your\" Neto",
        "rating": 82
      }
    },
    "fpx": {
      "players": [
        {
          "name": "ardiis",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Latvia",
          "image": "/jugadores/fpx/ardiis.png"
        },
        {
          "name": "Shao",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/shao.png"
        },
        {
          "name": "ANGE1",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Ukraine",
          "image": "/jugadores/fpx/ange1.png"
        },
        {
          "name": "Zyppan",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Sweden",
          "image": "/jugadores/fpx/zyppan.png"
        },
        {
          "name": "SUYGETSU",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/fpx/suygetsu.png"
        }
      ],
      "coach": {
        "name": "Jakob \"Remmey\" Hansen",
        "rating": 82
      }
    }
  },
  "masters-shanghai-2024": {
    "geng": {
      "players": [
        {
          "name": "t3xture",
          "rating": 97,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/t3xture.png"
        },
        {
          "name": "Munchkin",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "Karon",
          "rating": 93,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/karon.png"
        },
        {
          "name": "Lakia",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/lakia.png"
        },
        {
          "name": "Meteor",
          "rating": 95,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/geng/meteor.png"
        }
      ],
      "coach": {
        "name": "Park \"Autumn\" Gyeong-jun",
        "rating": 87
      }
    },
    "heretics": {
      "players": [
        {
          "name": "Wo0t",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/wo0t.png"
        },
        {
          "name": "benjyfishy",
          "rating": 91,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/heretics/benjyfishy.png"
        },
        {
          "name": "Boo",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/boo.png"
        },
        {
          "name": "RieNs",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/riens.png"
        },
        {
          "name": "MiniBoo",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/miniboo.png"
        }
      ],
      "coach": {
        "name": "Nuno \"your\" Neto",
        "rating": 83
      }
    },
    "g2": {
      "players": [
        {
          "name": "leaf",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "trent",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/trent.png"
        },
        {
          "name": "valyn",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/g2/valyn.png"
        },
        {
          "name": "icy",
          "rating": 86,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/icy.png"
        },
        {
          "name": "JonahP",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/g2/jonahp.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 82
      }
    },
    "100t": {
      "players": [
        {
          "name": "Cryo",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/cryo.png"
        },
        {
          "name": "bang",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/bang.png"
        },
        {
          "name": "Derrek",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/derrek.png"
        },
        {
          "name": "stellar",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/stellar.png"
        },
        {
          "name": "Asuna",
          "rating": 90,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/asuna.png"
        }
      ],
      "coach": {
        "name": "Sean \"sgares\" Gares",
        "rating": 81
      }
    },
    "fut": {
      "players": [
        {
          "name": "cNed",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/acend/cned.png"
        },
        {
          "name": "yetujey",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/yetujey.png"
        },
        {
          "name": "MrFaliN",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Turkey",
          "image": "/jugadores/fut/MrFaliN.png"
        },
        {
          "name": "xeus",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/xeus.png"
        },
        {
          "name": "AtaKaptan",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Turkey",
          "image": "/jugadores/fut/atakaptan.png"
        }
      ],
      "coach": {
        "name": "Mert \"Turko\" Tankut",
        "rating": 79
      }
    },
    "prx": {
      "players": [
        {
          "name": "Jinggg",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        },
        {
          "name": "something",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "f0rsakeN",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "mindfreak",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 86
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Guo \"seven\" Qi",
        "rating": 82
      }
    },
    "drx": {
      "players": [
        {
          "name": "BuZz",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/buzz.png"
        },
        {
          "name": "Flashback",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/flashback.png"
        },
        {
          "name": "BeYN",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/drx/beyn.png"
        },
        {
          "name": "MaKo",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/drx/mako.png"
        },
        {
          "name": "stax",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/drx/stax.png"
        }
      ],
      "coach": {
        "name": "Kim \"termi\" Kyung-min",
        "rating": 85
      }
    },
    "leviatan": {
      "players": [
        {
          "name": "aspas",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Brazil",
          "image": "/jugadores/leviatan/aspas.png"
        },
        {
          "name": "tex",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/leviatan/tex.png"
        },
        {
          "name": "Mazino",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/kru/mazino.png"
        },
        {
          "name": "C0M",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "USA",
          "image": "/jugadores/eg/c0m.png"
        },
        {
          "name": "kiNgg",
          "rating": 93,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Chile",
          "image": "/jugadores/leviatan/kiNgg.png"
        }
      ],
      "coach": {
        "name": "Ignacio \"tEoS\" Aravena",
        "rating": 83
      }
    },
    "fnatic": {
      "players": [
        {
          "name": "Derke",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Finland",
          "image": "/jugadores/fnatic/derke.png"
        },
        {
          "name": "Chronicle",
          "rating": 92,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Boaster",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "Leo",
          "rating": 91,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Sweden",
          "image": "/jugadores/fnatic/leo.png"
        },
        {
          "name": "Alfajer",
          "rating": 93,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 84
      }
    },
    "t1": {
      "players": [
        {
          "name": "Sayaplayer",
          "rating": 85,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/t1/sayaplayer.png"
        },
        {
          "name": "Carpe",
          "rating": 83,
          "primaryRole": "INITIATOR",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/t1/carpe.png"
        },
        {
          "name": "k1Ng",
          "rating": 82,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "South Korea",
          "image": "/jugadores/vs/k1ng.png"
        },
        {
          "name": "Munchkin",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        },
        {
          "name": "xeta",
          "rating": 83,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/c9/xeta.png"
        }
      ],
      "coach": {
        "name": "Yoon \"Autumn\" Eu-teum",
        "rating": 81
      }
    }
  },
  "masters-toronto-2025": {
    "fnatic": {
      "players": [
        {
          "name": "Alfajer",
          "rating": 96,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/fnatic/alfajer.png"
        },
        {
          "name": "Chronicle",
          "rating": 95,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "Russia",
          "image": "/jugadores/fnatic/chronicle.png"
        },
        {
          "name": "Boaster",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "UK",
          "image": "/jugadores/fnatic/boaster.png"
        },
        {
          "name": "crashies",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/envy/crashies.png"
        },
        {
          "name": "kaajak",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Czech Republic",
          "image": "/jugadores/fnatic/kaajak.png"
        }
      ],
      "coach": {
        "name": "Jacob \"miniature\" Harris",
        "rating": 85
      }
    },
    "g2": {
      "players": [
        {
          "name": "leaf",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/c9/leaf.png"
        },
        {
          "name": "trent",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/trent.png"
        },
        {
          "name": "valyn",
          "rating": 90,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "SENTINEL",
          "nationality": "USA",
          "image": "/jugadores/g2/valyn.png"
        },
        {
          "name": "icy",
          "rating": 87,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/g2/icy.png"
        },
        {
          "name": "JonahP",
          "rating": 88,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/g2/jonahp.png"
        }
      ],
      "coach": {
        "name": "Erik \"d00mbr0s\" Sandgren",
        "rating": 83
      }
    },
    "geng": {
      "players": [
        {
          "name": "t3xture",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/t3xture.png"
        },
        {
          "name": "Meteor",
          "rating": 94,
          "primaryRole": "SENTINEL",
          "secondaryRole": "DUELIST",
          "nationality": "South Korea",
          "image": "/jugadores/geng/meteor.png"
        },
        {
          "name": "Karon",
          "rating": 92,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/karon.png"
        },
        {
          "name": "Lakia",
          "rating": 88,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "South Korea",
          "image": "/jugadores/geng/lakia.png"
        },
        {
          "name": "Munchkin",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "INITIATOR",
          "nationality": "South Korea",
          "image": "/jugadores/geng/munchkin.png"
        }
      ],
      "coach": {
        "name": "Park \"Autumn\" Gyeong-jun",
        "rating": 87
      }
    },
    "prx": {
      "players": [
        {
          "name": "f0rsakeN",
          "rating": 96,
          "primaryRole": "FLEX",
          "secondaryRole": "SENTINEL",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/f0rsaken.png"
        },
        {
          "name": "something",
          "rating": 93,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/prx/something.png"
        },
        {
          "name": "d4v41",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Malaysia",
          "image": "/jugadores/prx/d4v41.png"
        },
        {
          "name": "mindfreak",
          "rating": 89,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "Indonesia",
          "image": "/jugadores/prx/mindfreak.png"
        },
        {
          "name": "Jinggg",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Singapore",
          "image": "/jugadores/prx/jinggg.png"
        }
      ],
      "coach": {
        "name": "Alexandre \"alecks\" Sallby",
        "rating": 86
      }
    },
    "wolves": {
      "players": [
        {
          "name": "Cloud",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/giantx/cloud.png"
        },
        {
          "name": "westside",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/giantx/westside.png"
        },
        {
          "name": "runneR",
          "rating": 85,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/giantx/runneR.png"
        },
        {
          "name": "nukkye",
          "rating": 85,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "Lithuania",
          "image": "/jugadores/g2/nukkye.png"
        },
        {
          "name": "Purp0",
          "rating": 88,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Russia",
          "image": "/jugadores/giantx/purp0.png"
        }
      ],
      "coach": {
        "name": "David \"Dreamas\" Batard",
        "rating": 79
      }
    },
    "sentinels": {
      "players": [
        {
          "name": "zekken",
          "rating": 94,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zekken.png"
        },
        {
          "name": "N4RRATE",
          "rating": 92,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/sentinels/n4rrate.png"
        },
        {
          "name": "bang",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/100t/bang.png"
        },
        {
          "name": "johnqt",
          "rating": 89,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Morocco",
          "image": "/jugadores/sentinels/johnqt.png"
        },
        {
          "name": "Zellsis",
          "rating": 87,
          "primaryRole": "FLEX",
          "secondaryRole": "CONTROLLER",
          "nationality": "USA",
          "image": "/jugadores/sentinels/zellsis.png"
        }
      ],
      "coach": {
        "name": "Adam \"Kaplan\" Kaplan",
        "rating": 82
      }
    },
    "rrq": {
      "players": [
        {
          "name": "Jemkin",
          "rating": 92,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/jemkin.png"
        },
        {
          "name": "Monyet",
          "rating": 90,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/monyet.png"
        },
        {
          "name": "xffero",
          "rating": 87,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/xffero.png"
        },
        {
          "name": "Kushy",
          "rating": 86,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/kushy.png"
        },
        {
          "name": "Estrella",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/rrq/estrella.png"
        }
      ],
      "coach": {
        "name": "Siddhart \"Guts\" Gopalkrishnan",
        "rating": 78
      }
    },
    "xlg": {
      "players": [
        {
          "name": "Rarga",
          "rating": 89,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/rarga.png"
        },
        {
          "name": "happywei",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/happywei.png"
        },
        {
          "name": "Viva",
          "rating": 86,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/viva.png"
        },
        {
          "name": "Midi",
          "rating": 84,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/midi.png"
        },
        {
          "name": "coconut",
          "rating": 85,
          "primaryRole": "FLEX",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/xlg/coconut.png"
        }
      ],
      "coach": {
        "name": "Sun \"Trainer\" Hao",
        "rating": 76
      }
    },
    "heretics": {
      "players": [
        {
          "name": "Wo0t",
          "rating": 94,
          "primaryRole": "FLEX",
          "secondaryRole": "DUELIST",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/wo0t.png"
        },
        {
          "name": "benjyfishy",
          "rating": 90,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "UK",
          "image": "/jugadores/heretics/benjyfishy.png"
        },
        {
          "name": "Boo",
          "rating": 88,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "INITIATOR",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/boo.png"
        },
        {
          "name": "RieNs",
          "rating": 87,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "Turkey",
          "image": "/jugadores/heretics/riens.png"
        },
        {
          "name": "MiniBoo",
          "rating": 91,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "Lithuania",
          "image": "/jugadores/heretics/miniboo.png"
        }
      ],
      "coach": {
        "name": "Nuno \"your\" Neto",
        "rating": 83
      }
    },
    "nrg": {
      "players": [
        {
          "name": "brawk",
          "rating": 96,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/brawk.png"
        },
        {
          "name": "mada",
          "rating": 94,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/mada.png"
        },
        {
          "name": "s0m",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "DUELIST",
          "nationality": "USA",
          "image": "/jugadores/nrg/s0m.png"
        },
        {
          "name": "skuba",
          "rating": 89,
          "primaryRole": "SENTINEL",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/skuba.png"
        },
        {
          "name": "Ethan",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "FLEX",
          "nationality": "USA",
          "image": "/jugadores/nrg/ethan.png"
        }
      ],
      "coach": {
        "name": "Chet \"Chet\" Singh",
        "rating": 88
      }
    },
    "edg": {
      "players": [
        {
          "name": "ZmjjKK",
          "rating": 95,
          "primaryRole": "DUELIST",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/ZmjjKK.png"
        },
        {
          "name": "CHICHOO",
          "rating": 93,
          "primaryRole": "INITIATOR",
          "secondaryRole": "SENTINEL",
          "nationality": "China",
          "image": "/jugadores/edg/chichoo.png"
        },
        {
          "name": "Smoggy",
          "rating": 91,
          "primaryRole": "CONTROLLER",
          "secondaryRole": "FLEX",
          "nationality": "China",
          "image": "/jugadores/edg/smoggy.png"
        },
        {
          "name": "Haodong",
          "rating": 87,
          "primaryRole": "SENTINEL",
          "secondaryRole": "CONTROLLER",
          "nationality": "China",
          "image": "/jugadores/edg/haodong.png"
        },
        {
          "name": "nobody",
          "rating": 90,
          "primaryRole": "FLEX",
          "secondaryRole": "INITIATOR",
          "nationality": "China",
          "image": "/jugadores/edg/nobody.png"
        }
      ],
      "coach": {
        "name": "Guo \"seven\" Qi",
        "rating": 82
      }
    }
  }
};
