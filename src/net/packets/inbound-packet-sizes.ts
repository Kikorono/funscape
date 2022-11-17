// @todo make this automatic via the packet files - Kat 2/Nov/22
const INBOUND_PACKET_SIZES: { [key: number]: { [key: number]: number }} = {};

INBOUND_PACKET_SIZES[414] = {
    // @todo fill out packet sizes - Kat 13/Nov/22
};

INBOUND_PACKET_SIZES[357] = {
    50: 3,
    132: 3,
    245: 0,
    218: 1,
    110: 1,
    30: 0,
    160: 3,
    239: 4,
    142: 2,
    202: 8,
    92: 0,
    73: 8,
    140: 13,
    187: 10,
    106: 12,
    190: 4,
    169: 2,
    32: 2,
    18: 2,
    85: 4,
    113: 2,
    105: 2,
    138: 2,
    20: 4,
    148: 2,
    90: 6,
    55: 8,
    185: 2,
    172: 6,
    8: 6,
    75: 2,
    119: 6,
    57: 2,
    109: 6,
    49: 2,
    211: 2,
    86: 12,
    156: 4,
    7: 6,
    130: 8,
    192: 6,
    235: 8,
    131: 6,
    16: 2,
    145: 6,
    78: 6,
    163: 2,
    99: 2,
    205: 2,
    242: 6,
    183: 8,
    72: 1,
    28: 6,
    250: 8,
    243: 6,
    41: 6,
    35: 6,
    144: 4,
    33: 6,
    27: 6,
    189: 6,
    69: 12,
    83: 4,
    100: 6,
    24: 6,
    80: 1,
    48: 4,
    23: 4,
    240: 1,
    2: -1,
    207: 7,
    166: 0,
    46: 0,
    176: 8,
    26: -1,
    66: -1,
    77: -1,
    213: -1,
    56: -1,
    175: 4,
    147: 8,
    225: -1,
    91: -1,
};

INBOUND_PACKET_SIZES[319] = {
    64: 8,
    33: 6,
    46: 2,
    211: 6,
    98: 6,
    184: 8,
    111: 2,
    132: 6,
    25: 0,
    4: 2,
    6: 6,
    29: 3,
    183: 6,
    244: 2,
    70: 2,
    128: 6,
    228: 6,
    149: 6,
    207: 2,
    83: 6,
    47: 8,
    186: 1,
    17: 6,
    18: 12,
    115: 6,
    103: 2,
    123: 6,
    189: 2,
    154: 6,
    156: 2,
    107: 4,
    55: 4,
    175: 2,
    114: 6,
    134: 2,
    161: 8,
    125: 6,
    187: 2,
    169: 6,
    54: 3,
    229: 2,
    88: 8,
    188: 12,
    202: 6,
    212: 8,
    136: 6,
    49: 2,
    165: 6,
    181: 3,
    0: 6,
    112: 8,
    155: -1,
    178: -1,
    191: -1,
    250: 1,
    76: 4,
    79: 4,
    223: 1,
    205: -1,
    117: -1,
    121: 0,
    63: 0,
    24: 13,
    31: 10,
    108: -1,
    232: 8,
    226: 4,
    104: 3,
    57: 0,
    235: -1,
    171: 4,
    105: 8,
    192: -1,
    141: -1,
    77: 8,
    69: 1,
    173: 0,
    199: 0,
    177: -1,
};

INBOUND_PACKET_SIZES[289] = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 6,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 8,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 2,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 2,
    31: 0,
    32: 0,
    33: 0,
    34: -1,
    35: 0,
    36: 0,
    37: 0,
    38: 0,
    39: 0,
    40: 6,
    41: 0,
    42: 0,
    43: 0,
    44: 6,
    45: 0,
    46: 0,
    47: 0,
    48: 0,
    49: 0,
    50: 0,
    51: 0,
    52: 0,
    53: 0,
    54: 0,
    55: 0,
    56: 0,
    57: 0,
    58: 0,
    59: 0,
    60: 0,
    61: 0,
    62: 0,
    63: 0,
    64: 0,
    65: 0,
    66: 0,
    67: -1,
    68: 0,
    69: 2,
    70: 0,
    71: 0,
    72: 0,
    73: 0,
    74: 0,
    75: 0,
    76: 6,
    77: 0,
    78: 0,
    79: 6,
    80: 0,
    81: 0,
    82: 0,
    83: 0,
    84: 0,
    85: 0,
    86: 2,
    87: 0,
    88: 0,
    89: 0,
    90: 0,
    91: 0,
    92: 0,
    93: 0,
    94: 10,
    95: 0,
    96: 0,
    97: 0,
    98: 0,
    99: 0,
    100: 0,
    101: 0,
    102: 0,
    103: 0,
    104: 0,
    105: 0,
    106: 0,
    107: -1,
    108: 0,
    109: 0,
    110: 0,
    111: 0,
    112: 0,
    113: 0,
    114: 0,
    115: 0,
    116: 0,
    117: 0,
    118: 0,
    119: 0,
    120: 0,
    121: 0,
    122: 0,
    123: 0,
    124: 0,
    125: 0,
    126: 0,
    127: 0,
    128: 0,
    129: 0,
    130: -1,
    131: 0,
    132: 0,
    133: 0,
    134: 0,
    135: 0,
    136: 0,
    137: 1,
    138: 0,
    139: 0,
    140: 0,
    141: 0,
    142: 0,
    143: 0,
    144: 0,
    145: 0,
    146: 0,
    147: 0,
    148: 0,
    149: 1,
    150: 0,
    151: 0,
    152: 0,
    153: 0,
    154: 0,
    155: 0,
    156: -1,
    157: 0,
    158: 0,
    159: 0,
    160: 0,
    161: 3,
    162: 0,
    163: 0,
    164: 0,
    165: 0,
    166: 0,
    167: 0,
    168: 0,
    169: 0,
    170: 0,
    171: 0,
    172: 0,
    173: 0,
    174: 0,
    175: 0,
    176: 0,
    177: 6,
    178: 2,
    179: 0,
    180: 0,
    181: 0,
    182: 0,
    183: 0,
    184: 0,
    185: 0,
    186: 0,
    187: 2,
    188: 0,
    189: 0,
    190: 0,
    191: 0,
    192: 8,
    193: 4,
    194: 0,
    195: 0,
    196: 0,
    197: 0,
    198: 0,
    199: 0,
    200: 12,
    201: 0,
    202: 0,
    203: 8,
    204: 4,
    205: 0,
    206: 0,
    207: 0,
    208: 0,
    209: 0,
    210: 0,
    211: 0,
    212: 0,
    213: 0,
    214: 0,
    215: 0,
    216: 0,
    217: 0,
    218: 0,
    219: 0,
    220: 0,
    221: 0,
    222: 0,
    223: 0,
    224: 4,
    225: 0,
    226: 0,
    227: 0,
    228: 0,
    229: 0,
    230: 0,
    231: 0,
    232: 0,
    233: 0,
    234: -1,
    235: 8,
    236: -1,
    237: 0,
    238: 0,
    239: 0,
    240: 0,
    241: 0,
    242: 0,
    243: 0,
    244: 0,
    245: 0,
    246: 0,
    247: 2,
    248: 0,
    249: 0,
    250: 0,
    251: 8,
    252: 2,
    253: 7,
    254: 0,
    255: 0,
}

export default INBOUND_PACKET_SIZES;
