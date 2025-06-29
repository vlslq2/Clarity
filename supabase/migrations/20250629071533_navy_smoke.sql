/*
  # Fix category icons to use proper emojis

  1. Updates
    - Replace any text-based icon names with proper emoji icons
    - Ensure all categories have valid emoji icons
    - Fix any categories that might have invalid icon values

  2. Security
    - Only updates icon field, preserves all other category data
*/

-- Update categories with proper emoji icons
UPDATE categories SET icon = '🍽️' WHERE name ILIKE '%mâncare%' OR name ILIKE '%food%' OR name ILIKE '%dining%';
UPDATE categories SET icon = '🚗' WHERE name ILIKE '%transport%' OR name ILIKE '%car%' OR name ILIKE '%gas%';
UPDATE categories SET icon = '🛍️' WHERE name ILIKE '%cumpărături%' OR name ILIKE '%shopping%' OR name ILIKE '%retail%';
UPDATE categories SET icon = '🎬' WHERE name ILIKE '%divertisment%' OR name ILIKE '%entertainment%' OR name ILIKE '%movies%';
UPDATE categories SET icon = '💡' WHERE name ILIKE '%utilități%' OR name ILIKE '%utilities%' OR name ILIKE '%bills%';
UPDATE categories SET icon = '🏥' WHERE name ILIKE '%sănătate%' OR name ILIKE '%health%' OR name ILIKE '%medical%';
UPDATE categories SET icon = '📚' WHERE name ILIKE '%educație%' OR name ILIKE '%education%' OR name ILIKE '%school%';
UPDATE categories SET icon = '🏠' WHERE name ILIKE '%casa%' OR name ILIKE '%home%' OR name ILIKE '%garden%';
UPDATE categories SET icon = '👕' WHERE name ILIKE '%îmbrăcăminte%' OR name ILIKE '%clothing%' OR name ILIKE '%fashion%';
UPDATE categories SET icon = '📱' WHERE name ILIKE '%tehnologie%' OR name ILIKE '%technology%' OR name ILIKE '%tech%';
UPDATE categories SET icon = '✈️' WHERE name ILIKE '%călătorii%' OR name ILIKE '%travel%' OR name ILIKE '%vacation%';
UPDATE categories SET icon = '⚽' WHERE name ILIKE '%sport%' OR name ILIKE '%fitness%' OR name ILIKE '%gym%';
UPDATE categories SET icon = '🎁' WHERE name ILIKE '%cadouri%' OR name ILIKE '%gifts%' OR name ILIKE '%presents%';
UPDATE categories SET icon = '🐕' WHERE name ILIKE '%animale%' OR name ILIKE '%pets%' OR name ILIKE '%pet%';
UPDATE categories SET icon = '💰' WHERE name ILIKE '%venituri%' OR name ILIKE '%income%' OR name ILIKE '%salary%';
UPDATE categories SET icon = '📦' WHERE name ILIKE '%altele%' OR name ILIKE '%other%' OR name ILIKE '%misc%';

-- Fix any categories that might have text-based icons (like FaPlane, FaCar, etc.)
UPDATE categories SET icon = '✈️' WHERE icon LIKE 'Fa%Plane%' OR icon LIKE '%plane%';
UPDATE categories SET icon = '🚗' WHERE icon LIKE 'Fa%Car%' OR icon LIKE '%car%';
UPDATE categories SET icon = '🏠' WHERE icon LIKE 'Fa%Home%' OR icon LIKE '%home%';
UPDATE categories SET icon = '🛍️' WHERE icon LIKE 'Fa%Shopping%' OR icon LIKE '%shopping%';
UPDATE categories SET icon = '🎬' WHERE icon LIKE 'Fa%Film%' OR icon LIKE '%film%';
UPDATE categories SET icon = '💡' WHERE icon LIKE 'Fa%Lightbulb%' OR icon LIKE '%light%';
UPDATE categories SET icon = '🏥' WHERE icon LIKE 'Fa%Hospital%' OR icon LIKE '%hospital%';
UPDATE categories SET icon = '📚' WHERE icon LIKE 'Fa%Book%' OR icon LIKE '%book%';
UPDATE categories SET icon = '📱' WHERE icon LIKE 'Fa%Mobile%' OR icon LIKE '%mobile%';
UPDATE categories SET icon = '💰' WHERE icon LIKE 'Fa%Money%' OR icon LIKE '%money%';

-- Set default icon for any categories that don't have a proper emoji
UPDATE categories SET icon = '📦' WHERE icon IS NULL OR icon = '' OR LENGTH(icon) > 10 OR icon NOT SIMILAR TO '%[🎭🎨🎪🎫🎬🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐪🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾🐿👀👁👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢👣👤👥👦👧👨👩👪👫👬👭👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧💨💩💪💫💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📬📭📮📯📰📱📲📳📴📵📶📷📸📹📺📻📼📽📾📿🔀🔁🔂🔃🔄🔅🔆🔇🔈🔉🔊🔋🔌🔍🔎🔏🔐🔑🔒🔓🔔🔕🔖🔗🔘🔙🔚🔛🔜🔝🔞🔟🔠🔡🔢🔣🔤🔥🔦🔧🔨🔩🔪🔫🔬🔭🔮🔯🔰🔱🔲🔳🔴🔵🔶🔷🔸🔹🔺🔻🔼🔽🔾🔿🕀🕁🕂🕃🕄🕅🕆🕇🕈🕉🕊🕋🕌🕍🕎🕏🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧🕨🕩🕪🕫🕬🕭🕮🕯🕰🕱🕲🕳🕴🕵🕶🕷🕸🕹🕺🕻🕼🕽🕾🕿🖀🖁🖂🖃🖄🖅🖆🖇🖈🖉🖊🖋🖌🖍🖎🖏🖐🖑🖒🖓🖔🖕🖖🖗🖘🖙🖚🖛🖜🖝🖞🖟🖠🖡🖢🖣🖤🖥🖦🖧🖨🖩🖪🖫🖬🖭🖮🖯🖰🖱🖲🖳🖴🖵🖶🖷🖸🖹🖺🖻🖼🖽🖾🖿🗀🗁🗂🗃🗄🗅🗆🗇🗈🗉🗊🗋🗌🗍🗎🗏🗐🗑🗒🗓🗔🗕🗖🗗🗘🗙🗚🗛🗜🗝🗞🗟🗠🗡🗢🗣🗤🗥🗦🗧🗨🗩🗪🗫🗬🗭🗮🗯🗰🗱🗲🗳🗴🗵🗶🗷🗸🗹🗺🗻🗼🗽🗾🗿😀😁😂😃😄😅😆😇😈😉😊😋😌😍😎😏😐😑😒😓😔😕😖😗😘😙😚😛😜😝😞😟😠😡😢😣😤😥😦😧😨😩😪😫😬😭😮😯😰😱😲😳😴😵😶😷😸😹😺😻😼😽😾😿🙀🙁🙂🙃🙄🙅🙆🙇🙈🙉🙊🙋🙌🙍🙎🙏🚀🚁🚂🚃🚄🚅🚆🚇🚈🚉🚊🚋🚌🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚙🚚🚛🚜🚝🚞🚟🚠🚡🚢🚣🚤🚥🚦🚧🚨🚩🚪🚫🚬🚭🚮🚯🚰🚱🚲🚳🚴🚵🚶🚷🚸🚹🚺🚻🚼🚽🚾🚿🛀🛁🛂🛃🛄🛅🛆🛇🛈🛉🛊🛋🛌🛍🛎🛏🛐🛑🛒🛓🛔🛕🛖🛗🛘🛙🛚🛛🛜🛝🛞🛟🛠🛡🛢🛣🛤🛥🛦🛧🛨🛩🛪🛫🛬🛭🛮🛯🛰🛱🛲🛳🛴🛵🛶🛷🛸🛹🛺🛻🛼🛽🛾🛿🟀🟁🟂🟃🟄🟅🟆🟇🟈🟉🟊🟋🟌🟍🟎🟏🟐🟑🟒🟓🟔🟕🟖🟗🟘🟙🟚🟛🟜🟝🟞🟟🟠🟡🟢🟣🟤🟥🟦🟧🟨🟩🟪🟫🟬🟭🟮🟯🟰🟱🟲🟳🟴🟵🟶🟷🟸🟹🟺🟻🟼🟽🟾🟿🤀🤁🤂🤃🤄🤅🤆🤇🤈🤉🤊🤋🤌🤍🤎🤏🤐🤑🤒🤓🤔🤕🤖🤗🤘🤙🤚🤛🤜🤝🤞🤟🤠🤡🤢🤣🤤🤥🤦🤧🤨🤩🤪🤫🤬🤭🤮🤯🤰🤱🤲🤳🤴🤵🤶🤷🤸🤹🤺🤻🤼🤽🤾🤿🥀🥁🥂🥃🥄🥅🥆🥇🥈🥉🥊🥋🥌🥍🥎🥏🥐🥑🥒🥓🥔🥕🥖🥗🥘🥙🥚🥛🥜🥝🥞🥟🥠🥡🥢🥣🥤🥥🥦🥧🥨🥩🥪🥫🥬🥭🥮🥯🥰🥱🥲🥳🥴🥵🥶🥷🥸🥹🥺🥻🥼🥽🥾🥿🦀🦁🦂🦃🦄🦅🦆🦇🦈🦉🦊🦋🦌🦍🦎🦏🦐🦑🦒🦓🦔🦕🦖🦗🦘🦙🦚🦛🦜🦝🦞🦟🦠🦡🦢🦣🦤🦥🦦🦧🦨🦩🦪🦫🦬🦭🦮🦯🦰🦱🦲🦳🦴🦵🦶🦷🦸🦹🦺🦻🦼🦽🦾🦿🧀🧁🧂🧃🧄🧅🧆🧇🧈🧉🧊🧋🧌🧍🧎🧏🧐🧑🧒🧓🧔🧕🧖🧗🧘🧙🧚🧛🧜🧝🧞🧟🧠🧡🧢🧣🧤🧥🧦🧧🧨🧩🧪🧫🧬🧭🧮🧯🧰🧱🧲🧳🧴🧵🧶🧷🧸🧹🧺🧻🧼🧽🧾🧿🩀🩁🩂🩃🩄🩅🩆🩇🩈🩉🩊🩋🩌🩍🩎🩏🩐🩑🩒🩓🩔🩕🩖🩗🩘🩙🩚🩛🩜🩝🩞🩟🩠🩡🩢🩣🩤🩥🩦🩧🩨🩩🩪🩫🩬🩭🩮🩯🩰🩱🩲🩳🩴🩵🩶🩷🩸🩹🩺🩻🩼🩽🩾🩿🪀🪁🪂🪃🪄🪅🪆🪇🪈🪉🪊🪋🪌🪍🪎🪏🪐🪑🪒🪓🪔🪕🪖🪗🪘🪙🪚🪛🪜🪝🪞🪟🪠🪡🪢🪣🪤🪥🪦🪧🪨🪩🪪🪫🪬🪭🪮🪯🪰🪱🪲🪳🪴🪵🪶🪷🪸🪹🪺🪻🪼🪽🪾🪿🫀🫁🫂🫃🫄🫅🫆🫇🫈🫉🫊🫋🫌🫍🫎🫏🫐🫑🫒🫓🫔🫕🫖🫗🫘🫙🫚🫛🫜🫝🫞🫟🫠🫡🫢🫣🫤🫥🫦🫧🫨🫩🫪🫫🫬🫭🫮🫯🫰🫱🫲🫳🫴🫵🫶🫷🫸🫹🫺🫻🫼🫽🫾🫿🬀🬁🬂🬃🬄🬅🬆🬇🬈🬉🬊🬋🬌🬍🬎🬏🬐🬑🬒🬓🬔🬕🬖🬗🬘🬙🬚🬛🬜🬝🬞🬟🬠🬡🬢🬣🬤🬥🬦🬧🬨🬩🬪🬫🬬🬭🬮🬯🬰🬱🬲🬳🬴🬵🬶🬷🬸🬹🬺🬻🬼🬽🬾🬿🭀🭁🭂🭃🭄🭅🭆🭇🭈🭉🭊🭋🭌🭍🭎🭏🭐🭑🭒🭓🭔🭕🭖🭗🭘🭙🭚🭛🭜🭝🭞🭟🭠🭡🭢🭣🭤🭥🭦🭧🭨🭩🭪🭫🭬🭭🭮🭯🭰🭱🭲🭳🭴🭵🭶🭷🭸🭹🭺🭻🭼🭽🭾🭿🮀🮁🮂🮃🮄🮅🮆🮇🮈🮉🮊🮋🮌🮍🮎🮏🮐🮑🮒🮓🮔🮕🮖🮗🮘🮙🮚🮛🮜🮝🮞🮟🮠🮡🮢🮣🮤🮥🮦🮧🮨🮩🮪🮫🮬🮭🮮🮯🮰🮱🮲🮳🮴🮵🮶🮷🮸🮹🮺🮻🮼🮽🮾🮿🯀🯁🯂🯃🯄🯅🯆🯇🯈🯉🯊🯋🯌🯍🯎🯏🯐🯑🯒🯓🯔🯕🯖🯗🯘🯙🯚🯛🯜🯝🯞🯟🯠🯡🯢🯣🯤🯥🯦🯧🯨🯩🯪🯫🯬🯭🯮🯯🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹🯺🯻🯼🯽🯾🯿🰀🰁🰂🰃🰄🰅🰆🰇🰈🰉🰊🰋🰌🰍🰎🰏🰐🰑🰒🰓🰔🰕🰖🰗🰘🰙🰚🰛🰜🰝🰞🰟🰠🰡🰢🰣🰤🰥🰦🰧🰨🰩🰪🰫🰬🰭🰮🰯🰰🰱🰲🰳🰴🰵🰶🰷🰸🰹🰺🰻🰼🰽🰾🰿🱀🱁🱂🱃🱄🱅🱆🱇🱈🱉🱊🱋🱌🱍🱎🱏🱐🱑🱒🱓🱔🱕🱖🱗🱘🱙🱚🱛🱜🱝🱞🱟🱠🱡🱢🱣🱤🱥🱦🱧🱨🱩🱪🱫🱬🱭🱮🱯🱰🱱🱲🱳🱴🱵🱶🱷🱸🱹🱺🱻🱼🱽🱾🱿🲀🲁🲂🲃🲄🲅🲆🲇🲈🲉🲊🲋🲌🲍🲎🲏🲐🲑🲒🲓🲔🲕🲖🲗🲘🲙🲚🲛🲜🲝🲞🲟🲠🲡🲢🲣🲤🲥🲦🲧🲨🲩🲪🲫🲬🲭🲮🲯🲰🲱🲲🲳🲴🲵🲶🲷🲸🲹🲺🲻🲼🲽🲾🲿🳀🳁🳂🳃🳄🳅🳆🳇🳈🳉🳊🳋🳌🳍🳎🳏🳐🳑🳒🳓🳔🳕🳖🳗🳘🳙🳚🳛🳜🳝🳞🳟🳠🳡🳢🳣🳤🳥🳦🳧🳨🳩🳪🳫🳬🳭🳮🳯🳰🳱🳲🳳🳴🳵🳶🳷🳸🳹🳺🳻🳼🳽🳾🳿🴀🴁🴂🴃🴄🴅🴆🴇🴈🴉🴊🴋🴌🴍🴎🴏🴐🴑🴒🴓🴔🴕🴖🴗🴘🴙🴚🴛🴜🴝🴞🴟🴠🴡🴢🴣🴤🴥🴦🴧🴨🴩🴪🴫🴬🴭🴮🴯🴰🴱🴲🴳🴴🴵🴶🴷🴸🴹🴺🴻🴼🴽🴾🴿🵀🵁🵂🵃🵄🵅🵆🵇🵈🵉🵊🵋🵌🵍🵎🵏🵐🵑🵒🵓🵔🵕🵖🵗🵘🵙🵚🵛🵜🵝🵞🵟🵠🵡🵢🵣🵤🵥🵦🵧🵨🵩🵪🵫🵬🵭🵮🵯🵰🵱🵲🵳🵴🵵🵶🵷🵸🵹🵺🵻🵼🵽🵾🵿🶀🶁🶂🶃🶄🶅🶆🶇🶈🶉🶊🶋🶌🶍🶎🶏🶐🶑🶒🶓🶔🶕🶖🶗🶘🶙🶚🶛🶜🶝🶞🶟🶠🶡🶢🶣🶤🶥🶦🶧🶨🶩🶪🶫🶬🶭🶮🶯🶰🶱🶲🶳🶴🶵🶶🶷🶸🶹🶺🶻🶼🶽🶾🶿🷀🷁🷂🷃🷄🷅🷆🷇🷈🷉🷊🷋🷌🷍🷎🷏🷐🷑🷒🷓🷔🷕🷖🷗🷘🷙🷚🷛🷜🷝🷞🷟🷠🷡🷢🷣🷤🷥🷦🷧🷨🷩🷪🷫🷬🷭🷮🷯🷰🷱🷲🷳🷴🷵🷶🷷🷸🷹🷺🷻🷼🷽🷾🷿🸀🸁🸂🸃🸄🸅🸆🸇🸈🸉🸊🸋🸌🸍🸎🸏🸐🸑🸒🸓🸔🸕🸖🸗🸘🸙🸚🸛🸜🸝🸞🸟🸠🸡🸢🸣🸤🸥🸦🸧🸨🸩🸪🸫🸬🸭🸮🸯🸰🸱🸲🸳🸴🸵🸶🸷🸸🸹🸺🸻🸼🸽🸾🸿🹀🹁🹂🹃🹄🹅🹆🹇🹈🹉🹊🹋🹌🹍🹎🹏🹐🹑🹒🹓🹔🹕🹖🹗🹘🹙🹚🹛🹜🹝🹞🹟🹠🹡🹢🹣🹤🹥🹦🹧🹨🹩🹪🹫🹬🹭🹮🹯🹰🹱🹲🹳🹴🹵🹶🹷🹸🹹🹺🹻🹼🹽🹾🹿🺀🺁🺂🺃🺄🺅🺆🺇🺈🺉🺊🺋🺌🺍🺎🺏🺐🺑🺒🺓🺔🺕🺖🺗🺘🺙🺚🺛🺜🺝🺞🺟🺠🺡🺢🺣🺤🺥🺦🺧🺨🺩🺪🺫🺬🺭🺮🺯🺰🺱🺲🺳🺴🺵🺶🺷🺸🺹🺺🺻🺼🺽🺾🺿🻀🻁🻂🻃🻄🻅🻆🻇🻈🻉🻊🻋🻌🻍🻎🻏🻐🻑🻒🻓🻔🻕🻖🻗🻘🻙🻚🻛🻜🻝🻞🻟🻠🻡🻢🻣🻤🻥🻦🻧🻨🻩🻪🻫🻬🻭🻮🻯🻰🻱🻲🻳🻴🻵🻶🻷🻸🻹🻺🻻🻼🻽🻾🻿🼀🼁🼂🼃🼄🼅🼆🼇🼈🼉🼊🼋🼌🼍🼎🼏🼐🼑🼒🼓🼔🼕🼖🼗🼘🼙🼚🼛🼜🼝🼞🼟🼠🼡🼢🼣🼤🼥🼦🼧🼨🼩🼪🼫🼬🼭🼮🼯🼰🼱🼲🼳🼴🼵🼶🼷🼸🼹🼺🼻🼼🼽🼾🼿🽀🽁🽂🽃🽄🽅🽆🽇🽈🽉🽊🽋🽌🽍🽎🽏🽐🽑🽒🽓🽔🽕🽖🽗🽘🽙🽚🽛🽜🽝🽞🽟🽠🽡🽢🽣🽤🽥🽦🽧🽨🽩🽪🽫🽬🽭🽮🽯🽰🽱🽲🽳🽴🽵🽶🽷🽸🽹🽺🽻🽼🽽🽾🽿🾀🾁🾂🾃🾄🾅🾆🾇🾈🾉🾊🾋🾌🾍🾎🾏🾐🾑🾒🾓🾔🾕🾖🾗🾘🾙🾚🾛🾜🾝🾞🾟🾠🾡🾢🾣🾤🾥🾦🾧🾨🾩🾪🾫🾬🾭🾮🾯🾰🾱🾲🾳🾴🾵🾶🾷🾸🾹🾺🾻🾼🾽🾾🾿🿀🿁🿂🿃🿄🿅🿆🿇🿈🿉🿊🿋🿌🿍🿎🿏🿐🿑🿒🿓🿔🿕🿖🿗🿘🿙🿚🿛🿜🿝🿞🿟🿠🿡🿢🿣🿤🿥🿦🿧🿨🿩🿪🿫🿬🿭🿮🿯🿰🿱🿲🿳🿴🿵🿶🿷🿸🿹🿺🿻🿼🿽🿾🿿]%';