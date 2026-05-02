
-- ====== 20260222_seed_act1.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — ACT 1 시나리오 데이터 시드
-- Supabase SQL Editor에서 실행
-- ═══════════════════════════════════════════

-- ── ACT 1 노드 ──

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- 오프닝
('act1_opening', 'main_citizen', 1, 'story',
 '{"ko":"━━━ VERIDIAN BREAKING NEWS ━━━\n\n스마트폰 화면이 진동과 함께 깨어난다.\n\nVBS 속보: \"오늘 밤 11시 58분, 대통령이 Directive 6를 발동했습니다. 계엄군이 수도 Centris를 향해 이동 중이며, Grand Assembly의 모든 활동이 중단될 예정입니다. 시민 여러분은 외출을 자제하시기 바—\"\n\n방송이 끊긴다.\n\n한세진의 전화기가 울린다.\n\"지도자님, 들으셨습니까? 6시간입니다. 계엄군이 Centris에 도착하기 전에 정족수를 모아 표결해야 합니다.\"\n\n시계가 움직이기 시작한다.\n\n05:59:59... 05:59:58... 05:59:57...\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━","en":"Breaking news: The president has invoked Directive 6. Martial law forces are moving toward Centris. You have 6 hours."}',
 '{}', NULL, 0, NULL, NULL),

-- 분기점 1: 첫 대응
('act1_bp1', 'main_citizen', 1, 'branch_main',
 '{"ko":"계엄이 선포되었다. 6시간 카운트다운이 시작되었다.\n\n밖에서는 군용 헬기 소리가 들린다. 텔레비전은 사선 패턴만 보여주고 있다.\n\n지금 당장 무엇을 하겠는가?","en":"Martial law has been declared. The 6-hour countdown has begun. What will you do?"}',
 '{}', NULL, 5, NULL, NULL),

-- 경로 A: Grand Assembly 직행
('act1_route_a1', 'main_citizen', 1, 'story',
 '{"ko":"새벽 거리에 차를 몰았다. 도로는 텅 비었고, 라디오에서 다급한 뉴스가 흘러나온다.\n\n\"...시민 여러분께서는 통행을 자제해 주시기 바랍니다. 군 병력이 주요 거점으로 이동 중입니다...\"\n\n앞에 불빛이 보인다. 검문소다.","en":"You drive through empty streets. A military checkpoint appears ahead."}',
 '{}', NULL, 10, '{"will":1}', 'righteous'),

('act1_route_a2', 'main_citizen', 1, 'branch_sub',
 '{"ko":"군용 트럭 2대가 도로를 막고 있다. 군인이 손전등을 비추며 다가온다.\n\n\"차에서 내려주십시오. 신분증을 보여주세요.\"\n\n그의 손이 미세하게 떨리고 있다. 신병인가.","en":"Two military trucks block the road. A nervous-looking soldier approaches your window."}',
 '{}', NULL, 5, NULL, NULL),

-- 경로 B: VBS 방송국
('act1_route_b1', 'main_citizen', 1, 'story',
 '{"ko":"VBS 방송국 로비는 아수라장이다. 군인들이 기자들을 쫓아내고 있다.\n\n깨진 유리 사이로 앵커 노태식의 목소리가 들린다.\n\"카메라는 끄지 마! 이건 기록되어야 해!\"","en":"The VBS broadcasting station lobby is in chaos. Soldiers are forcing journalists out."}',
 '{}', NULL, 15, '{"intel":1}', NULL),

('act1_route_b2', 'main_citizen', 1, 'branch_sub',
 '{"ko":"노태식이 다급하게 달려온다.\n\"지도자님! 군이 방송을 장악했습니다. 하지만 비상 송출 장비가 지하에 있습니다. 5분이면 됩니다.\"\n\n그의 눈이 비장하다. 기자 정신이 살아있다.","en":"Anchor Noh Taesik rushes to you with urgent news about underground emergency broadcasting equipment."}',
 '{}', NULL, 5, NULL, NULL),

-- 경로 C: Liberty Square
('act1_route_c1', 'main_citizen', 1, 'story',
 '{"ko":"Liberty Square에 도착했다.\n\n이미 수백 명의 시민이 모여 있다. 촛불과 스마트폰 불빛이 어둠을 밝히고 있다.\n\n윤다혜가 확성기를 들고 연설 중이다.\n\"우리는 여기 있습니다! 우리는 물러나지 않습니다!\"","en":"Liberty Square is already filled with hundreds of citizens holding candles and phone lights."}',
 '{}', NULL, 15, '{"public":1}', 'humanist'),

('act1_route_c2', 'main_citizen', 1, 'branch_sub',
 '{"ko":"군중이 당신을 알아본다.\n\"한세진 지도자님이다!\"\n\n함성이 울린다. 윤다혜가 확성기를 건넨다.\n\"지도자님, 한 말씀만. 사람들이 흔들리고 있어요.\"\n\n멀리서 경찰 사이렌 소리가 들린다. 시간이 많지 않다.","en":"The crowd recognizes you. Yoon Dahye hands you the megaphone as police sirens wail in the distance."}',
 '{}', NULL, 5, NULL, NULL),

-- 경로 D: 해커 Zero (프리미엄)
('act1_route_d1', 'main_citizen', 1, 'story',
 '{"ko":"암호화된 통화가 연결되었다.\n\n차영은의 목소리가 변조기를 통해 들린다.\n\"Directive 6의 원본 문서를 입수했습니다. 거기... 이상한 게 있어요.\"\n\n키보드 치는 소리가 빠르게 들린다.","en":"An encrypted call connects. Hacker Zero''s voice comes through a modulator with urgent intelligence."}',
 '{}', NULL, 5, '{"intel":2}', 'pragmatic'),

('act1_route_d2', 'main_citizen', 1, 'branch_sub',
 '{"ko":"\"계엄 명령서에 서명이 두 개입니다.\"\n\n침묵.\n\n\"대통령 것 하나... 그리고 하나가 더.\"\n\n\"정보부장 강무현입니다.\"\n\n이건... 대통령 단독이 아니라는 뜻이다. 누군가 뒤에서 조종하고 있다.","en":"\"There are two signatures on the martial law order. The president... and Intelligence Director Kang Muhyun.\""}',
 '{}', NULL, 5, '{"intel":1}', NULL),

-- Choke Point 1: Grand Assembly 도착
('act1_choke1', 'main_citizen', 1, 'choke',
 '{"ko":"Grand Assembly의 정문.\n\n거대한 돌기둥 사이로 비상등이 깜빡인다. 군용 차량 3대가 주차장을 점거하고 있다.\n\n경비 대위가 다가온다.\n\"의원님, 여기는 현재 출입 통제 구역입니다. Directive 6에 의거하여 의회 활동이 중지되었습니다.\"\n\n그의 눈빛에서 갈등이 보인다. 그도 확신이 없다.","en":"The Grand Assembly entrance. Military vehicles occupy the parking lot. A conflicted guard captain approaches."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 2: 의회 진입
('act1_bp2', 'main_citizen', 1, 'branch_main',
 '{"ko":"잠긴 의회 건물. 경비병들이 입구를 지키고 있다.\n\n반드시 안으로 들어가야 한다. 정족수를 모으려면 의회 내부에 있어야 한다.\n\n어떻게 들어갈 것인가?","en":"The Assembly building is locked down. How will you get inside?"}',
 '{}', NULL, 5, NULL, NULL),

-- 의회 진입 결과 노드
('act1_bp2_result_a', 'main_citizen', 1, 'story',
 '{"ko":"경비 대위의 눈을 똑바로 바라보았다.\n\n\"대위, 당신도 알지 않습니까? 헌법 제77조 4항. 국회가 계엄 해제를 요구하면 대통령은 이에 따라야 합니다. 지금 당신이 막고 있는 건 국회 의원이 아닙니다. 헌법입니다.\"\n\n대위의 손이 무전기를 더듬는다. 길고 긴 침묵 후, 그가 비켜선다.","en":"You persuade the guard captain with constitutional law. After a long pause, he steps aside."}',
 '{}', NULL, 15, '{"network":1,"stealth":1}', 'righteous'),

('act1_bp2_result_b', 'main_citizen', 1, 'story',
 '{"ko":"지하 주차장의 비상구. 오래된 환기구로 들어갈 수 있다.\n\n숨을 죽이고 경비병의 순찰 패턴을 읽었다. 3분 간격. 그 사이에 들어가야 한다.\n\n어둠 속에서 문이 열린다. 성공이다.","en":"You sneak through the underground parking garage ventilation shaft, timing the guard patrol pattern."}',
 '{}', NULL, 20, '{"stealth":2}', 'pragmatic'),

('act1_bp2_result_c', 'main_citizen', 1, 'story',
 '{"ko":"시민들이 정문 앞에 모여든다.\n\n\"의원님을 들여보내라!\" \"헌법을 지켜라!\"\n\n함성이 커진다. 경비병들의 대열이 흔들린다.\n\n결국 정문이 열린다. 시민의 힘이다.","en":"Citizens gather at the gates demanding entry. The guards'' line wavers, and the doors open."}',
 '{"requires_public_6":true}', NULL, 10, '{"public":1,"will":1}', 'humanist'),

('act1_bp2_result_d', 'main_citizen', 1, 'story',
 '{"ko":"서윤하 재판관이 전화를 받는다.\n\n\"한 의원, 나도 생중계 보고 있습니다. 지금 위헌 심판 개시 결정문을 작성 중입니다. 의회 접근은 법적으로 보장됩니다.\"\n\n5분 후, 팩스가 경비실에 도착한다. 대위가 경례를 한다.\n\"...통과하십시오.\"","en":"Judge Seo Yunha issues an emergency constitutional ruling guaranteeing Assembly access."}',
 '{}', NULL, 5, '{"intel":1,"network":1}', 'righteous'),

-- 분기점 3: 첫 번째 동맹
('act1_bp3', 'main_citizen', 1, 'branch_main',
 '{"ko":"의회 건물 내부. 비상등만 켜진 복도.\n\n갑자기 세 사람에게서 동시에 연락이 온다. 모두 도와주겠다고 한다.\n\n하지만 이 시간에 모두를 만날 수는 없다. 한 사람을 선택해야 한다.\n\n누구를 믿을 것인가?","en":"Inside the Assembly. Three people reach out simultaneously, each offering help. You can only choose one."}',
 '{}', NULL, 5, NULL, NULL),

-- 동맹 결과 노드
('act1_bp3_result_a', 'main_citizen', 1, 'story',
 '{"ko":"백준서 총리가 비밀 통로로 들어온다.\n\n\"세진, 나를 믿어. 대통령 측근 중 3명은 내가 설득할 수 있어. 하지만 시간이 필요해. 30분만 줘.\"\n\n40년을 살아남은 정치인의 미소. 위기에서도 여유로운 그 표정이... 어딘가 계산적이다.\n마치 이 상황을 기다렸다는 듯이.\n\n[백준서와의 동맹이 성립되었습니다]","en":"PM Baek Junseo arrives through a hidden passage. His smile is calculated — as if he''s been waiting for this crisis."}',
 '{}', NULL, 30, '{"network":2}', 'pragmatic'),

('act1_bp3_result_b', 'main_citizen', 1, 'story',
 '{"ko":"오진석 경찰청장이 경호원 2명과 도착한다.\n\n\"지금부터 이 건물은 경찰이 관할합니다. 군이 함부로 들어올 수 없습니다.\"\n\n그가 부하들에게 지시한다. 하지만 한 경호원의 시선이 불안하다.\n\n[오진석과의 동맹이 성립되었습니다]","en":"Police Chief Oh Jinseok arrives with two officers to secure the building under police jurisdiction."}',
 '{}', NULL, 15, '{"stealth":2,"will":1}', 'righteous'),

('act1_bp3_result_c', 'main_citizen', 1, 'story',
 '{"ko":"사라 첸의 카메라 렌즈에 빨간 불이 들어온다.\n\n\"전 세계에 생중계 중입니다. 현재 Veridian Republic 의회에서 한세진 반대파 지도자와 함께 하고 있습니다.\"\n\n전화가 쏟아진다. BBC, CNN, NHK...\n\"글로벌 관심이 집중되면 군부가 함부로 못합니다.\"\n\n[사라 첸과의 동맹이 성립되었습니다]","en":"Sarah Chen''s camera goes live, broadcasting worldwide. Global media attention floods in."}',
 '{}', NULL, 20, '{"public":3}', 'humanist'),

('act1_bp3_result_d', 'main_citizen', 1, 'story',
 '{"ko":"강무현 정보부장이 어둠 속에서 나타난다.\n\n\"...대통령은 꼭두각시야. 진짜 적은 따로 있어.\"\n\n그가 USB를 건넨다.\n\"여기 Protocol Zero의 원본이 있어. 이게 뭔지 알면... 모든 게 달라질 거야.\"\n\n그의 눈빛이 진지하다. 하지만 이 사람은 계엄 명령서에 서명한 사람이다.\n\n[강무현과의 은밀한 동맹이 성립되었습니다]\n[숨겨진 루트 Sentinel 해금]","en":"Intelligence Director Kang Muhyun emerges from the shadows with a USB containing Protocol Zero."}',
 '{}', NULL, 10, '{"intel":4}', 'conspiring'),

-- Act 1 종료
('act1_ending', 'main_citizen', 1, 'story',
 '{"ko":"━━━ ACT 1 종료 ━━━\n\n첫 번째 시간이 지났다.\n의회 건물 안에 자리를 잡았고, 동맹을 확보했다.\n\n하지만 아직 표결에 필요한 정족수(The Quorum)에는 한참 모자란다.\n\n그때, 의회 건물의 모든 전등이 꺼진다.\n통신이 끊긴다.\n모든 화면이 암전된다.\n\n장태호 사령관의 목소리가 건물 스피커로 울려 퍼진다.\n\n\"Grand Assembly 내부의 모든 인원에게 고합니다. Protocol Zero가 발동되었습니다. 30분 이내에 건물을 비우지 않으면... 우리는 진입합니다.\"\n\n━━━ ACT 2: 대치 시작 ━━━","en":"ACT 1 COMPLETE. The lights go out. Commander Jang Taeho''s voice echoes: Protocol Zero activated. 30 minutes to evacuate... or they enter."}',
 '{}', NULL, 0, NULL, NULL),

-- 실패 노드
('act1_fail_arrested', 'main_citizen', 1, 'ending',
 '{"ko":"경찰이 당신의 팔을 잡는다.\n\n\"한세진 의원, Directive 6 위반으로 체포합니다.\"\n\n수갑이 차가운 손목을 감싼다. 호송차 뒤에서, 멀리 Grand Assembly의 불빛이 꺼져가는 것이 보인다.\n\n끝나지 않았다. 다음에는 다르게 해야 한다.\n\n[감옥에서의 새벽 엔딩]\n[영구 해금: 군경 검문소 위치 정보]","en":"You are arrested. From the back of the transport vehicle, you watch the Assembly lights fade. It''s not over. Next time will be different."}',
 '{"title":{"ko":"감옥에서의 새벽","en":"Dawn Behind Bars"},"grade":"bad"}', NULL, 0, NULL, NULL),

('act1_fail_timeout', 'main_citizen', 1, 'ending',
 '{"ko":"시간이 흘렀다. 너무 많은 시간이.\n\n새벽 5시, 계엄군 장갑차가 Centris 시내로 진입한다.\n\nGrand Assembly 정문이 폭파된다.\n\n텔레비전에 장태호 사령관의 얼굴이 나온다.\n\"질서가 회복되었습니다.\"\n\n질서. 그것은 침묵의 다른 이름이었다.\n\n[계엄군 입성 엔딩]\n[영구 해금: 군 이동 경로]","en":"Time runs out. Military vehicles enter the city. The Assembly doors are breached. Silence reigns."}',
 '{"title":{"ko":"침묵의 새벽","en":"Silent Dawn"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── ACT 1 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- 분기점 1: 첫 대응
('main_citizen', 'act1_bp1', 0,
 '{"ko":"🏛️ Grand Assembly로 직행한다","en":"Head straight to the Grand Assembly"}',
 '{"ko":"지금은 속도가 생명이다","en":"Speed is everything right now"}',
 'act1_route_a1', 20, '{"will":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp1', 1,
 '{"ko":"📺 VBS 방송국으로 향한다","en":"Head to VBS Broadcasting Station"}',
 '{"ko":"세상이 이걸 알아야 한다","en":"The world needs to know about this"}',
 'act1_route_b1', 25, '{"intel":2,"public":1}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp1', 2,
 '{"ko":"👥 Liberty Square로 가서 시민과 합류","en":"Join citizens at Liberty Square"}',
 '{"ko":"사람들이 모이면 바뀐다","en":"When people gather, things change"}',
 'act1_route_c1', 25, '{"public":2,"network":1}', NULL, 'humanist', '{"yoon_dahye":1}', FALSE, 0, TRUE, 'will', 4, 'act1_fail_arrested'),

('main_citizen', 'act1_bp1', 3,
 '{"ko":"🔒 해커 Zero에게 긴급 연락","en":"Contact Hacker Zero"}',
 '{"ko":"적의 움직임부터 파악해야 한다","en":"We need to know the enemy''s movements first"}',
 'act1_route_d1', 10, '{"intel":3,"stealth":1}', NULL, 'pragmatic', NULL, TRUE, 50, FALSE, NULL, NULL, NULL),

-- 경로 A: 검문소 선택지
('main_citizen', 'act1_route_a2', 0,
 '{"ko":"🗣️ 신분을 밝히고 통과를 요구한다","en":"Reveal your identity and demand passage"}',
 '{"ko":"나는 국회의원이다. 비켜라.","en":"I am a member of parliament. Stand aside."}',
 'act1_choke1', 5, '{"will":1}', NULL, 'righteous', NULL, FALSE, 0, TRUE, 'will', 4, 'act1_fail_arrested'),

('main_citizen', 'act1_route_a2', 1,
 '{"ko":"🚗 우회로를 찾는다","en":"Find an alternate route"}',
 '{"ko":"정면 돌파는 위험하다","en":"A head-on approach is too risky"}',
 'act1_choke1', 10, '{"stealth":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_a2', 2,
 '{"ko":"🔒 비서관의 위조 통행증을 사용한다","en":"Use the secretary''s forged pass"}',
 '{"ko":"때로는 규칙을 어겨야 한다","en":"Sometimes you have to break the rules"}',
 'act1_choke1', 3, '{"stealth":2}', NULL, 'conspiring', NULL, TRUE, 30, FALSE, NULL, NULL, NULL),

-- 경로 B: 방송국 선택지
('main_citizen', 'act1_route_b2', 0,
 '{"ko":"📡 비상 장비로 긴급 성명을 발표한다","en":"Make an emergency broadcast"}',
 '{"ko":"시민들이 진실을 알아야 한다","en":"Citizens deserve to know the truth"}',
 'act1_choke1', 15, '{"public":2,"stealth":-1}', NULL, 'humanist', '{"sarah_chen":1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_b2', 1,
 '{"ko":"📤 노태식에게 맡기고 Assembly로 출발","en":"Leave it to Noh and head to the Assembly"}',
 '{"ko":"내 자리는 의회다","en":"My place is at the Assembly"}',
 'act1_choke1', 5, NULL, NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_b2', 2,
 '{"ko":"💻 서버에서 군 통신 기록을 빼낸다","en":"Extract military communication records from the server"}',
 '{"ko":"증거를 확보해야 한다","en":"We need hard evidence"}',
 'act1_choke1', 10, '{"intel":2}', '{"intel":{"min":2}}', 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 경로 C: 광장 선택지
('main_citizen', 'act1_route_c2', 0,
 '{"ko":"📢 광장에서 시민 연설","en":"Give a public speech at the square"}',
 '{"ko":"지금 이 순간을 역사로 만들자","en":"Let''s make this moment history"}',
 'act1_choke1', 20, '{"network":2,"public":2}', NULL, 'humanist', '{"yoon_dahye":2}', FALSE, 0, TRUE, 'will', 6, 'act1_fail_arrested'),

('main_citizen', 'act1_route_c2', 1,
 '{"ko":"🤝 윤다혜에게 시민 동원을 맡기고 출발","en":"Entrust Yoon Dahye with mobilizing citizens"}',
 '{"ko":"역할 분담이 중요하다","en":"We need to divide our roles"}',
 'act1_choke1', 5, '{"network":1}', NULL, 'pragmatic', '{"yoon_dahye":1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_c2', 2,
 '{"ko":"🚶 시민들과 함께 Assembly까지 행진","en":"March to the Assembly together with citizens"}',
 '{"ko":"함께라면 두렵지 않다","en":"Together, we are not afraid"}',
 'act1_choke1', 30, '{"network":1,"public":3}', NULL, 'radical', '{"yoon_dahye":1}', FALSE, 0, FALSE, NULL, NULL, NULL),

-- 경로 D: 해커 선택지
('main_citizen', 'act1_route_d2', 0,
 '{"ko":"📂 이 정보를 들고 Assembly로 직행","en":"Take this intel and head straight to the Assembly"}',
 '{"ko":"증거가 있으면 싸움이 된다","en":"With evidence, we can fight"}',
 'act1_choke1', 10, '{"intel":3}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_d2', 1,
 '{"ko":"🔍 Zero에게 더 파달라고 요청","en":"Ask Zero to dig deeper"}',
 '{"ko":"더 파면 뭐가 나올까","en":"What else might we find?"}',
 'act1_choke1', 20, '{"intel":4}', NULL, 'conspiring', '{"kang_muhyun":-1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_route_d2', 2,
 '{"ko":"📰 이 정보를 외신 기자 사라에게 전달","en":"Share this intel with journalist Sarah Chen"}',
 '{"ko":"전 세계가 알아야 한다","en":"The whole world needs to know"}',
 'act1_choke1', 15, '{"public":2}', NULL, 'humanist', '{"sarah_chen":2}', FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 2: 의회 진입
('main_citizen', 'act1_bp2', 0,
 '{"ko":"🗣️ 경비 대위를 설득한다","en":"Persuade the guard captain"}',
 '{"ko":"당신도 알지 않습니까? 이건 위헌입니다","en":"You know this is unconstitutional"}',
 'act1_bp2_result_a', 15, NULL, '{"will":{"min":5}}', 'righteous', NULL, FALSE, 0, TRUE, 'will', 5, 'act1_fail_arrested'),

('main_citizen', 'act1_bp2', 1,
 '{"ko":"🚪 지하 주차장 비상구로 잠입","en":"Infiltrate through the underground parking garage"}',
 '{"ko":"정문만 막고 있을 리 없다","en":"They can''t be blocking every entrance"}',
 'act1_bp2_result_b', 20, NULL, '{"stealth":{"min":3}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'stealth', 3, 'act1_choke1'),

('main_citizen', 'act1_bp2', 2,
 '{"ko":"📱 시민들의 압력으로 정문 돌파","en":"Break through with citizen pressure"}',
 '{"ko":"이 많은 시민을 다 막을 수는 없을 것이다","en":"They can''t stop all these people"}',
 'act1_bp2_result_c', 10, NULL, '{"public":{"min":6}}', 'humanist', NULL, FALSE, 0, TRUE, 'public', 6, 'act1_choke1'),

('main_citizen', 'act1_bp2', 3,
 '{"ko":"🔒 서윤하 재판관의 긴급 명령 활용","en":"Use Judge Seo Yunha''s emergency ruling"}',
 '{"ko":"위헌 심판 개시 = 의회 접근 법적 보장","en":"Constitutional review = legal guarantee of Assembly access"}',
 'act1_bp2_result_d', 5, NULL, NULL, 'righteous', '{"seo_yunha":1}', TRUE, 70, FALSE, NULL, NULL, NULL),

-- 분기점 2 결과 → 분기점 3 연결
('main_citizen', 'act1_bp2_result_a', 0,
 '{"ko":"다음으로","en":"Continue"}',
 '{"ko":"","en":""}',
 'act1_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp2_result_b', 0,
 '{"ko":"다음으로","en":"Continue"}',
 '{"ko":"","en":""}',
 'act1_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp2_result_c', 0,
 '{"ko":"다음으로","en":"Continue"}',
 '{"ko":"","en":""}',
 'act1_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp2_result_d', 0,
 '{"ko":"다음으로","en":"Continue"}',
 '{"ko":"","en":""}',
 'act1_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 3: 첫 번째 동맹
('main_citizen', 'act1_bp3', 0,
 '{"ko":"🏛️ 백준서 총리의 제안을 받아들인다","en":"Accept PM Baek''s proposal"}',
 '{"ko":"내가 대통령 측근들을 설득할 수 있소","en":"I can convince the president''s allies"}',
 'act1_bp3_result_a', 30, '{"network":2}', NULL, 'pragmatic', '{"baek_junseo":2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3', 1,
 '{"ko":"🚔 오진석 경찰청장의 제안을 받아들인다","en":"Accept Police Chief Oh''s proposal"}',
 '{"ko":"경찰이 군을 대신해서 의회를 경호하겠습니다","en":"Police will guard the Assembly instead of the military"}',
 'act1_bp3_result_b', 15, '{"stealth":2,"will":1}', NULL, 'righteous', '{"oh_jinseok":2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3', 2,
 '{"ko":"📡 사라 첸에게 독점 인터뷰","en":"Give Sarah Chen an exclusive interview"}',
 '{"ko":"전 세계에 생중계합니다","en":"Broadcasting live to the world"}',
 'act1_bp3_result_c', 20, '{"public":3}', NULL, 'humanist', '{"sarah_chen":3}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3', 3,
 '{"ko":"🕵️ 강무현 정보부장의 은밀한 접촉","en":"Secret meeting with Intelligence Director Kang"}',
 '{"ko":"대통령은 꼭두각시야. 진짜 적은 따로 있어.","en":"The president is a puppet. The real enemy is someone else."}',
 'act1_bp3_result_d', 10, '{"intel":4}', NULL, 'conspiring', '{"kang_muhyun":3}', TRUE, 80, FALSE, NULL, NULL, NULL),

-- 동맹 결과 → Act 1 종료 연결
('main_citizen', 'act1_bp3_result_a', 0,
 '{"ko":"계속...","en":"Continue..."}',
 '{"ko":"","en":""}',
 'act1_ending', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3_result_b', 0,
 '{"ko":"계속...","en":"Continue..."}',
 '{"ko":"","en":""}',
 'act1_ending', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3_result_c', 0,
 '{"ko":"계속...","en":"Continue..."}',
 '{"ko":"","en":""}',
 'act1_ending', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_bp3_result_d', 0,
 '{"ko":"계속...","en":"Continue..."}',
 '{"ko":"","en":""}',
 'act1_ending', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ ACT 1 시나리오 시드 완료


-- ====== 20260222_seed_act1_expanded.sql ======
-- ═══════════════════════════════════════════════════
-- 6 Hours v2 — ACT 1 확장 시드
-- 서브 분기점 8개 + 미니 이벤트 10개 + 랜덤 조우 5개
-- scenario_expanded_v2.md 기반
-- ═══════════════════════════════════════════════════

-- ──────────────────────────────────────
-- 1. 서브 분기점 노드 (Sub-BP)
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ── Sub-1A: 출발 전 준비 (BP1-A 직행경로 진입 직후) ──
('act1_sub1a', 'main_citizen', 1, 'branch_sub',
 '{"ko":"새벽 0시 15분. 집을 나서기 전.\n\n잠든 아내와 아이가 보인다.\n스마트폰에 속보가 쏟아진다.\n\n시간이 없다. 하지만...","en":"0:15 AM. Before leaving home. Your sleeping family. Breaking news flooding your phone. No time, but..."}',
 '{}', NULL, 5, NULL, NULL),

('act1_sub1a_result_a', 'main_citizen', 1, 'story',
 '{"ko":"아내의 이마에 입술을 댄다.\n\n\"미안해. 돌아올게.\"\n\n메모 한 장을 냉장고에 붙인다.\n''금고 비밀번호: 0612. 혹시 모르니까.''\n\n마음이 무겁지만, 준비가 됐다.\n\n[가족 인사 완료 — 의지+1]","en":"You kiss your wife''s forehead. Leave a note with the safe combination. Heavy heart, but ready."}',
 '{}', NULL, 10, '{"will":1}', 'humanist'),

('act1_sub1a_result_b', 'main_citizen', 1, 'story',
 '{"ko":"시간이 없다.\n\n현관문을 조용히 닫는다.\n계단을 뛰어내려간다.\n\n뒤돌아보지 않는다.\n뒤돌아보면 멈출 것 같으니까.\n\n[즉시 출발 — 시간 절약 5분]","en":"No time. You close the door silently and run. Don''t look back. You might stop."}',
 '{}', NULL, 5, NULL, 'pragmatic'),

-- ── Sub-1B: 검문소 조우 (직행 경로 도중) ──
('act1_sub1b', 'main_citizen', 1, 'branch_sub',
 '{"ko":"Centris 3번 교차로.\n\n군 검문소.\n장갑차 1대. 병사 6명.\n자동소총의 검은 실루엣.\n\n\"차량 정지! 신분증!\"","en":"Military checkpoint at Centris Intersection 3. One APC, six soldiers with automatic rifles. ''Vehicle stop! ID!''"}',
 '{}', NULL, 5, NULL, NULL),

('act1_sub1b_result_a', 'main_citizen', 1, 'story',
 '{"ko":"의원 배지를 내밀었다.\n\n\"국회의원 한세진입니다.\n즉각 통과를 요구합니다.\"\n\n병사가 무전을 친다.\n30초... 1분...\n\n\"...통과하십시오.\"\n\n병사의 눈에 복잡한 감정이 비친다.\n존경? 두려움? 아니면 연민?\n\n[정면 돌파 — 시간 약간 소비]","en":"You flash your congressional badge. ''Let me through.'' After a tense minute, the soldier waves you on. Something complex in his eyes."}',
 '{}', NULL, 10, NULL, 'righteous'),

('act1_sub1b_result_b', 'main_citizen', 1, 'story',
 '{"ko":"뒷골목으로 우회한다.\n\n나침반 앱을 켜고 골목길을 누빈다.\n주택가 사이의 좁은 길.\n\n고양이 한 마리가 놀라 도망친다.\n\n15분을 더 돌았지만, 안전하게 검문소를 피했다.\n\n[우회 성공 — 은신+1, 시간 15분 추가 소비]","en":"You navigate backstreets using a compass app. 15 minutes longer, but you bypass the checkpoint safely."}',
 '{}', NULL, 15, '{"stealth":1}', 'pragmatic'),

('act1_sub1b_result_c', 'main_citizen', 1, 'story',
 '{"ko":"차영은이 보내준 위조 차량 통행증.\n\n\"이건 군 참모부 차량 등록 번호예요.\n위성 번호판도 준비했고요.\"\n\n검문소에서 경례까지 받으며 통과한다.\n\n...이게 맞는 건가?\n\n[위조증 통과 — 정보+1, 은신+2, 프리미엄 크레딧 50₡]","en":"Zero''s forged military vehicle pass gets you saluted through the checkpoint. Is this right?"}',
 '{"premium_choice":true,"premium_cost":50}', NULL, 5, '{"intel":1,"stealth":2}', 'conspiring'),

-- ── Sub-1D: 방송국 침입 방법 (BP1-B 방송국 경로) ──
('act1_sub1d', 'main_citizen', 1, 'branch_sub',
 '{"ko":"VBS 방송국.\n비상등만 켜진 건물.\n정문에 군 경비 2명.\n\n방송 장비가 있다면 전국에 메시지를 보낼 수 있다.\n어떻게 들어갈 것인가?","en":"VBS Broadcasting. Emergency lights only. Two military guards at the main entrance. How do you get in?"}',
 '{}', NULL, 5, NULL, NULL),

('act1_sub1d_result_a', 'main_citizen', 1, 'story',
 '{"ko":"\"국회의원 한세진입니다!\n긴급 국민 담화를 해야 합니다!\"\n\n경비가 당황한다.\n총을 들지만 쏘지 못한다.\n\n\"...들어가십시오. 하지만 15분입니다.\"\n\n[정문 돌파 — 의지+1, 제한시간 15분]","en":"You confront the guards head-on. They let you in reluctantly. 15 minutes limit."}',
 '{}', NULL, 5, '{"will":1}', 'righteous'),

('act1_sub1d_result_b', 'main_citizen', 1, 'story',
 '{"ko":"건물 뒤편.\n직원 출입구의 카드 리더기.\n\n노태식 PD의 메시지:\n\"3분 후에 뒷문 열어둘게.\n아는 경비가 눈 감아줄 거야.\"\n\n조용히 복도를 따라 스튜디오에 도착한다.\n\n[비밀 진입 — 은신+1, 시간제한 없음]","en":"PD Noh opens the back door. A sympathetic guard looks away. You slip into the studio undetected."}',
 '{}', NULL, 10, '{"stealth":1}', 'pragmatic'),

('act1_sub1d_result_c', 'main_citizen', 1, 'story',
 '{"ko":"지하 환기구.\n\n좁고 어둡다. 먼지 냄새.\n10분간 기어간다.\n\n그리고 환기구 격자 너머로 본다.\n\n스튜디오 안에... 군 장교가 앉아 있다.\n방송 검열관이다.\n\n\"모든 방송은 제가 검토합니다.\"\n\n예상치 못한 장애물.\n\n[지하 진입 — 검열관 발견, 추가 대응 필요]","en":"Through the ventilation shaft, you discover a military censor already inside the studio. An unexpected obstacle."}',
 '{}', NULL, 15, '{"intel":1}', 'conspiring'),

-- ── Sub-1H: 윤다혜와의 대화 깊이 (BP1-C 광장 경로) ──
('act1_sub1h', 'main_citizen', 1, 'branch_sub',
 '{"ko":"Liberty Square.\n\n윤다혜가 달려온다.\n\"한 지도자님! 오셨군요!\"\n\n그녀의 눈에 눈물이 고여 있다.\n하지만 목소리는 단단하다.\n\n\"3,000명이 모였어요.\n더 모이고 있고요.\n어떻게 하실 건가요?\"","en":"Liberty Square. Dahye runs to you. ''3,000 gathered. More coming. What''s the plan?''"}',
 '{}', NULL, 5, NULL, NULL),

('act1_sub1h_result_a', 'main_citizen', 1, 'story',
 '{"ko":"\"내가 지휘하겠다.\n윤 활동가, 시민들을 구역별로 나눠주시오.\"\n\n한세진이 리더십을 발휘한다.\n윤다혜가 살짝 입술을 깨문다.\n\n\"...알겠습니다, 지도자님.\"\n\n시민들이 질서정연하게 움직인다.\n하지만 윤다혜의 열정이 약간 꺾인 것 같다.\n\n[지도력 발휘 — 여론+2, 윤다혜 관계: 상관]","en":"You take command. Dahye follows orders, but her spark dims slightly. Organized, but the dynamic shifts."}',
 '{}', NULL, 10, '{"public":2}', 'righteous'),

('act1_sub1h_result_b', 'main_citizen', 1, 'story',
 '{"ko":"\"같이 합시다, 다혜 씨.\n당신이 거리를, 내가 정치를.\"\n\n윤다혜가 밝게 웃는다.\n\"좋아요! 파트너로!\"\n\n역할 분담이 자연스럽게 이루어진다.\n서로의 강점을 보완한다.\n\n[대등 협력 — 인맥+1, 여론+1, 윤다혜 관계: 동료]","en":"''Let''s work together. You take the streets, I''ll handle politics.'' Dahye beams. A natural partnership forms."}',
 '{}', NULL, 10, '{"network":1,"public":1}', 'humanist'),

('act1_sub1h_result_c', 'main_citizen', 1, 'story',
 '{"ko":"\"다혜 씨가 이 자리를 이끌어주시오.\n나는 의회로 가야 합니다.\"\n\n윤다혜의 눈이 반짝인다.\n\"...정말요? 제가요?\"\n\n\"국민이 당신의 목소리를 듣고 여기 모인 겁니다.\n당신이 적임자입니다.\"\n\n윤다혜가 확성기를 잡는 손에 힘이 들어간다.\n\n[위임 — 의지+1, 윤다혜 관계: 후원자]","en":"''You lead here. I''m going to the Assembly.'' Dahye''s eyes light up. ''Really? Me?'' You believe in her."}',
 '{}', NULL, 5, '{"will":1}', 'humanist'),

-- ── Sub-1I: 시민 연설 내용 (광장 경로 심화) ──
('act1_sub1i', 'main_citizen', 1, 'branch_sub',
 '{"ko":"윤다혜가 마이크를 건넨다.\n\n\"한 마디만. 시민들이 기다리고 있어요.\"\n\n3,000개의 눈이 한세진을 바라본다.\n촛불이 얼굴을 비춘다.\n\n무엇을 말할 것인가?","en":"Dahye hands you the microphone. 3,000 pairs of eyes and candles wait. What will you say?"}',
 '{}', NULL, 5, NULL, NULL),

('act1_sub1i_result_a', 'main_citizen', 1, 'story',
 '{"ko":"\"시민 여러분.\n오늘 밤, 우리는 소리 지르지 않겠습니다.\n우리는 노래하겠습니다.\"\n\n광장에 합창이 퍼진다.\n군인들이 멈칫한다.\n\n총을 들 수 없는 분위기.\n\n방송 카메라가 이 장면을 잡는다.\nSNS에 #CandleRevolution 태그가 폭발한다.\n\n[평화 호소 — 여론+3, 군경 동요]","en":"''Tonight, we don''t shout. We sing.'' A chorus fills the square. Soldiers freeze. #CandleRevolution trends globally."}',
 '{}', NULL, 10, '{"public":3}', 'humanist'),

('act1_sub1i_result_b', 'main_citizen', 1, 'story',
 '{"ko":"\"동지 여러분!\n저들이 탱크를 끌고 왔다면,\n우리는 몸으로 막겠습니다!\n\n민주주의는 선물이 아닙니다!\n피와 땀으로 쟁취하는 것입니다!\"\n\n함성이 터져 나온다.\n \"한세진! 한세진! 한세진!\"\n\n하지만 일부 군인의 표정이 굳어진다.\n\n[저항 선언 — 의지+3, 하지만 군 경계 강화]","en":"''If they bring tanks, we stand in the way! Democracy is not a gift — it''s won with blood and sweat!'' The crowd roars, but soldiers tighten their grip."}',
 '{}', NULL, 10, '{"will":3}', 'radical'),

('act1_sub1i_result_c', 'main_citizen', 1, 'story',
 '{"ko":"\"여러분, 헌법 제1조를 읽어드리겠습니다.\n\n''Veridian Republic은 민주공화국이다.''\n\n지금 대통령이 한 일은 헌법 위반입니다.\n계엄 선포 요건을 충족하지 못합니다.\n법적으로, 논리적으로, 도의적으로.\n\n우리가 옳습니다.\"\n\n조용하지만 확신에 찬 목소리.\n변호사, 교수들이 고개를 끄덕인다.\n\n[법적 논리 — 정보+2, 지식인층 지지 확보]","en":"You recite Article 1 of the Constitution. A quiet, confident legal argument. Lawyers and professors nod. The intellectual foundation is set."}',
 '{}', NULL, 10, '{"intel":2}', 'righteous')

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 2. 미니 이벤트 (감정선·몰입 강화)
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ME1: 새벽 거리 묘사 (출발 직후)
('act1_mini_dawn_streets', 'main_citizen', 1, 'mini_event',
 '{"ko":"새벽 0시 30분.\n\nCentris의 거리가 다르다.\n\n평소라면 네온사인이 번쩍이는 주점 거리.\n오늘은 모든 불이 꺼져 있다.\n\n멀리서 장갑차 엔진 소리가 들린다.\n하늘에 헬기 서치라이트가 수천 년 된 기억처럼\n도시를 훑고 지나간다.\n\n라디오에서 똑같은 메시지가 반복된다.\n\"...계엄령이 선포되었습니다.\n모든 시민은 귀가하십시오...\"\n\n한세진의 손이 핸들을 꽉 쥔다.","en":"0:30 AM. Centris is different tonight. All lights are off. Distant APC engines. Helicopter searchlights sweep the city like ancient memories. The radio repeats: ''Martial law declared. All citizens return home.''"}',
 '{"atmosphere":"tension"}', NULL, 3, NULL, NULL),

-- ME2: 군인과의 눈 마주침 (검문소 후)
('act1_mini_soldier_eyes', 'main_citizen', 1, 'mini_event',
 '{"ko":"검문소를 지나며 마지막으로 본 병사의 얼굴.\n\n20대 초반.\n아직 여드름 자국이 남아 있다.\n\n그의 눈에서 읽히는 것:\n두려움.\n\n\"이 아이도 누군가의 아들이다.\"\n\n한세진은 그 얼굴을 기억하기로 한다.\n오늘 밤이 끝나면,\n이 아이가 죄인이 되지 않게 해야 한다.","en":"The last soldier you see at the checkpoint. Early 20s. Acne scars. Fear in his eyes. ''He''s someone''s son. When tonight ends, I must make sure he won''t be a criminal.''"}',
 '{"atmosphere":"empathy"}', NULL, 2, NULL, NULL),

-- ME3: 뉴스 속보 삽입
('act1_mini_breaking_news', 'main_citizen', 1, 'mini_event',
 '{"ko":"━━━ 속보 ━━━\n\nVBS 뉴스 자막:\n\"정부, 계엄 선포는 국가 안보를 위한\n불가피한 조치라고 발표\"\n\n해외 언론:\nCNN: \"Veridian Republic 계엄 — 동부 민주주의 위기\"\nBBC: \"Midnight Coup? Veridian Leader Declares Martial Law\"\nNHK: \"ベリディアン共和国、戒厳令発動\"\n\n한세진의 스마트폰에 알림이 쏟아진다.\n이미 세계가 주목하고 있다.","en":"VBS: ''Government says martial law is inevitable for national security.'' CNN: ''Eastern Democracy in Crisis.'' BBC: ''Midnight Coup?'' The world is watching."}',
 '{"atmosphere":"urgency"}', NULL, 2, NULL, NULL),

-- ME4: SNS 반응
('act1_mini_sns_reaction', 'main_citizen', 1, 'mini_event',
 '{"ko":"스마트폰 화면:\n\n@citizen_2847: 지금 뭐야? 밖에 탱크 있어\n@liberty_mom: 아이들 재우고 나왔어요. 광장 어디예요?\n@soldier_anonymous: 나도 군인인데... 이건 아닌 것 같아\n@vip_supporter: 대통령님 만세! 빨갱이들 때려잡아라\n@haeun_lee23: 지금 광장으로 갑니다. — 이하은\n@zero_ghost: [암호화 링크] 페이퍼 컴퍼니 3곳. The Pinnacle과 연결. — Zero\n\n두 개의 트윗에 한세진의 눈이 멈춘다.\n대통령의 딸이 광장으로 간다... 그리고 비자금 경로?","en":"Social media: citizens posting, an anonymous soldier expressing doubt, a pro-government troll, and... the president''s daughter announcing she''s heading to the square."}',
 '{"atmosphere":"social"}', NULL, 2, NULL, NULL),

-- ME5: 의회 도착 시 묘사 (CP1 직전)
('act1_mini_arrival_assembly', 'main_citizen', 1, 'mini_event',
 '{"ko":"Grand Assembly.\n\n건물이 어둡다.\n\n평소라면 황금빛 조명이 대리석 기둥을 비추고,\n분수대에서 물소리가 나는 곳.\n\n오늘은 비상등의 붉은 빛만이\n건물 외벽에 그림자를 드리운다.\n\n현관 앞에 경찰 차량 4대.\n오진석 경찰청장이 팔짱을 끼고 서 있다.\n\n그가 한세진을 보자마자 말한다.\n\"올 줄 알았소, 한 지도자.\"\n\n\"못 올 줄 알았소?\"\n\n\"...아니. 안 올 리가 없지.\"","en":"Grand Assembly stands dark. Red emergency lights cast shadows on marble pillars. Police Chief Oh stands at the entrance. ''I knew you''d come.''"}',
 '{"atmosphere":"arrival"}', NULL, 3, NULL, NULL),

-- ME6: 경비 대위의 내면 (BP2 진입 시)
('act1_mini_guard_inner', 'main_citizen', 1, 'mini_event',
 '{"ko":"군 경비 대위 김성호.\n32세. 아내와 3살 딸이 있다.\n\n상관의 명령: \"의회 건물 진입을 허가하지 마라.\"\n\n하지만 앞에 서 있는 사람은\n그가 투표로 뽑은 국회의원이다.\n\n\"대위, 나는 이 건물에 들어갈 권리가 있소.\n헌법이 보장하고 있소.\"\n\n김성호의 손이 떨린다.\n자동소총의 안전장치가 아직 걸려 있다.\n\n\"...5분 드리겠습니다.\"\n\n그는 일부러 고개를 돌렸다.","en":"Captain Kim Sungho, 32, wife and 3-year-old daughter. His orders say ''deny entry.'' But the person in front of him is a lawmaker he voted for. His hands tremble. ''I''ll give you 5 minutes.'' He turns away deliberately."}',
 '{"atmosphere":"moral_conflict"}', NULL, 3, NULL, NULL),

-- ME7: 건물 내부 탐색 발견
('act1_mini_bunker_discovery', 'main_citizen', 1, 'mini_event',
 '{"ko":"의회 건물 지하 3층.\n\n1970년대 냉전 시절 핵 벙커.\n30년 넘게 아무도 내려오지 않은 곳.\n\n먼지가 뒤집어쓴 기기들 사이에서\n한세진은 벽에 새겨진 글귀를 발견한다.\n\n''1987. 7. 12.\nAw-Joon Park 대령 — 이 나라는 군인의 것이 아니다.\n부디 이 벙커가 쓸모없는 유물이 되기를.''\n\n39년 전에도 같은 일이 있었다.\n그때의 사람들도 이 벙커에서 숨었을까.","en":"In the Cold War bunker, an inscription from 1987: ''Colonel Park — This country does not belong to soldiers. May this bunker become a useless relic.'' 39 years ago, the same thing happened."}',
 '{"atmosphere":"historical"}', NULL, 3, NULL, NULL),

-- ME8: 동맹 체결 후 분위기
('act1_mini_alliance_mood', 'main_citizen', 1, 'mini_event',
 '{"ko":"동맹이 결성되었다.\n\n하지만 공기가 무겁다.\n\n각자 의자에 앉아 커피를 마시는 의원들.\n커피잔을 드는 손이 떨리는 사람이 있다.\n눈을 감고 무언가를 중얼거리는 사람이 있다.\n\n비서관이 속삭인다.\n\"지도자님, 저 사람 울고 있어요.\"\n\n어디선가 라디오 소리가 새어 나온다.\n\n\"...모든 집회는 불법이며...\"\n\n한세진이 라디오를 끈다.\n\"여기서는 우리가 법입니다.\"","en":"The alliance is formed, but the air is heavy. Trembling hands on coffee cups. Someone praying. Someone crying. You turn off the radio. ''In here, WE are the law.''"}',
 '{"atmosphere":"solidarity"}', NULL, 3, NULL, NULL),

-- ME9: 해커 경로 심화 — 차영은 캐릭터
('act1_mini_zero_profile', 'main_citizen', 1, 'mini_event',
 '{"ko":"차영은. 코드네임 Zero.\n\n\"원래 이름은 버렸어요.\n아버지가 정보부에 끌려갔거든요.\n15년 전에.\n아직 돌아오지 않았고요.\"\n\n키보드를 두드리는 그녀의 손가락.\n모니터에 비친 얼굴에 감정이 없다.\n\n\"그래서 해킹을 시작했어요.\n아버지를 찾으려고.\n\n...아직 못 찾았지만.\n대신 이 나라의 더러운 것들을 다 찾았죠.\"\n\n그녀가 화면을 돌린다.\nSentinel 네트워크의 첫 화면이 뜬다.","en":"Cha Youngeun. Codename Zero. ''My father was taken by intelligence 15 years ago. Never came back. I started hacking to find him. I haven''t. But I found everything else this country is hiding.''"}',
 '{"atmosphere":"character_depth","requires_route":"hacker"}', NULL, 3, NULL, NULL),

-- ME10: 의회 내 긴장감 (CP1 직후)
('act1_mini_tension_assembly', 'main_citizen', 1, 'mini_event',
 '{"ko":"시간: 약 01:15\n\n의회 본회의장.\n\n47명의 의원이 빈 좌석 사이에 흩어져 앉아 있다.\n300석 중 47석만 불이 켜져 있다.\n\n\"정족수는 151명.\n104명이 더 필요합니다.\"\n\n비서관의 목소리가 텅 빈 의사당에 울린다.\n\n모니터에 실시간 상황이 표시된다:\n- 연락 가능한 의원: 83명\n- 이동 중인 의원: 12명\n- 연락 두절: 56명\n- 군에 의해 차단됨: 추정 20명+\n\n\"83명... 다 모여도 모자라는군.\"\n\n한세진이 주먹을 쥔다.","en":"47 of 300 seats occupied. Quorum: 151 needed, 104 to go. 83 reachable, 12 en route, 56 unresponsive, 20+ blocked by military. ''Even if all 83 come... still not enough.''"}',
 '{"atmosphere":"desperation"}', NULL, 3, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 3. 랜덤 조우 (런마다 다르게 발생)
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag, encounter_weight, encounter_max) VALUES

-- R1: 탈영병
('act1_random_deserter', 'main_citizen', 1, 'random_encounter',
 '{"ko":"어두운 골목에서 누군가 비틀거리며 나타난다.\n\n군복. 피.\n\n\"...도와주세요. 저... 부대를 이탈했습니다.\"\n\n20대 병사. 손에 총은 없다.\n\n\"시민들한테 총을 쏘라는 명령이 내려왔어요.\n저는 못하겠습니다.\"\n\n그의 품에서 접힌 종이가 보인다.\n작전 명령서.","en":"A deserter stumbles from the shadows. Military uniform, blood. ''They ordered us to shoot civilians. I can''t.'' He has a folded operations order in his pocket."}',
 '{"encounter_pool":"act1","encounter_condition":"route_direct"}',
 NULL, 10, '{"intel":2}', NULL, 0.6, 1),

-- R2: 부상 시민
('act1_random_injured', 'main_citizen', 1, 'random_encounter',
 '{"ko":"길가에 한 여성이 쓰러져 있다.\n\n\"...도와주세요. 다리를...\"\n\n군인이 쐈는지 모른다.\n자동차에 치였는지도.\n중요한 건 피가 나고 있다는 것.\n\n시간은 없다.\n하지만 이 사람을 두고 갈 수 있는가?","en":"A woman lies injured on the roadside. Bleeding. Hit by a soldier? A car? Time is short, but can you leave her?"}',
 '{"encounter_pool":"act1","moral_choice":true}',
 NULL, 15, NULL, NULL, 0.7, 1),

-- R3: 비밀 전단
('act1_random_leaflet', 'main_citizen', 1, 'random_encounter',
 '{"ko":"바람에 날아온 전단지 하나.\n\n\"시민 여러분에게 알립니다.\nDirective 6은 제2조에 의해 불법입니다.\n이 전단을 복사하여 배포해주십시오.\n— 익명의 법학 교수\"\n\n전단지에 QR코드가 있다.\n스캔하면... 헌법 전문과 Directive 6 비교 문서로 연결된다.\n\n[정보+1]","en":"A windblown leaflet: ''Directive 6 is illegal under Article 2.'' QR code links to full constitutional analysis."}',
 '{"encounter_pool":"act1"}',
 NULL, 3, '{"intel":1}', NULL, 0.8, 1),

-- R4: 군 검열관 (방송국 경로)
('act1_random_censor', 'main_citizen', 1, 'random_encounter',
 '{"ko":"방송국 복도에서 군 검열관과 마주친다.\n\n\"...여기서 뭐 하시는 겁니까?\"\n\n이 사람을 피해야 한다.\n발각되면 체포당한다.\n\n은신 체크 필요.","en":"You run into the military censor in the broadcasting station corridor. ''What are you doing here?'' Stealth check required."}',
 '{"encounter_pool":"act1","encounter_condition":"route_broadcast","check_stat":"stealth","check_min":3}',
 NULL, 5, NULL, NULL, 0.5, 1),

-- R5: 할머니 증인
('act1_random_grandmother', 'main_citizen', 1, 'random_encounter',
 '{"ko":"의회 로비에서 한 할머니가 웅크리고 앉아 있다.\n\n\"할머니, 여기 어떻게 오셨어요?\"\n\n\"...1987년에도 이랬단다.\n그때 내 남편이 이 건물에서 죽었어.\n오늘도 같은 일이 벌어지는 거야?\"\n\n그녀의 손에는 바랜 사진.\n젊은 남자가 의회 건물 앞에서 웃고 있다.\n\n\"제발, 이번엔 끝내줘.\n39년이야. 39년.\"","en":"An elderly woman in the Assembly lobby. ''In 1987, my husband died in this building. Is it happening again? 39 years. Please, end it this time.''"}',
 '{"encounter_pool":"act1","atmosphere":"historical_depth"}',
 NULL, 5, '{"will":1}', 'humanist', 0.4, 1)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 4. 서브 분기점 선택지 연결
-- ──────────────────────────────────────

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Sub-1A: 출발 전 준비
('main_citizen', 'act1_sub1a', 0,
 '{"ko":"가족에게 인사하고 출발","en":"Say goodbye to family"}',
 '{"ko":"시간이 좀 걸리지만, 마음이 가벼워진다","en":"Takes time, but your heart feels lighter"}',
 'act1_sub1a_result_a', 10, '{"will":1}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1a', 1,
 '{"ko":"바로 출발","en":"Leave immediately"}',
 '{"ko":"시간을 아낀다","en":"Save precious time"}',
 'act1_sub1a_result_b', 5, NULL, NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Sub-1B: 검문소 조우
('main_citizen', 'act1_sub1b', 0,
 '{"ko":"🪪 의원 배지로 정면 통과","en":"Flash congressional badge"}',
 '{"ko":"떳떳하게 신분을 밝힌다","en":"Declare your identity proudly"}',
 'act1_sub1b_result_a', 10, NULL, NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1b', 1,
 '{"ko":"🏃 뒷골목으로 우회","en":"Take backstreet detour"}',
 '{"ko":"안전하지만 시간이 더 걸린다","en":"Safe but slower"}',
 'act1_sub1b_result_b', 15, '{"stealth":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1b', 2,
 '{"ko":"🔑 위조 통행증 사용 [50₡]","en":"Use forged pass [50₡]"}',
 '{"ko":"Zero가 준비한 위조 서류","en":"Zero''s forged military documents"}',
 'act1_sub1b_result_c', 5, '{"intel":1,"stealth":2}', NULL, 'conspiring', NULL, TRUE, 50, FALSE, NULL, NULL, NULL),

-- Sub-1D: 방송국 침입
('main_citizen', 'act1_sub1d', 0,
 '{"ko":"🚪 정문 돌파","en":"Storm the front door"}',
 '{"ko":"대담하게 진입. 시간제한 있음","en":"Bold entry. Time limit imposed"}',
 'act1_sub1d_result_a', 5, '{"will":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1d', 1,
 '{"ko":"🚶 직원 출입구 몰래 진입","en":"Sneak through staff entrance"}',
 '{"ko":"노태식 PD의 도움","en":"PD Noh''s help from inside"}',
 'act1_sub1d_result_b', 10, '{"stealth":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1d', 2,
 '{"ko":"🔧 지하 환기구","en":"Underground ventilation shaft"}',
 '{"ko":"위험하지만 아무도 모를 것이다","en":"Risky but undetected"}',
 'act1_sub1d_result_c', 15, '{"intel":1}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Sub-1H: 윤다혜와의 관계
('main_citizen', 'act1_sub1h', 0,
 '{"ko":"⚔️ 지도력 발휘 — 내가 이끈다","en":"Take command — I lead"}',
 '{"ko":"체계적이지만 윤다혜의 주도권 약화","en":"Organized, but Dahye''s initiative weakens"}',
 'act1_sub1h_result_a', 10, '{"public":2}', NULL, 'righteous', '{"yoon_dahye":-1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1h', 1,
 '{"ko":"🤝 대등 협력 — 파트너로","en":"Equal partnership"}',
 '{"ko":"각자의 강점을 살린다","en":"Leverage each other''s strengths"}',
 'act1_sub1h_result_b', 10, '{"network":1,"public":1}', NULL, 'humanist', '{"yoon_dahye":2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1h', 2,
 '{"ko":"🙏 위임 — 당신이 적임자","en":"Delegate — you''re the right person"}',
 '{"ko":"윤다혜에게 맡기고 의회로","en":"Trust Dahye and head to Assembly"}',
 'act1_sub1h_result_c', 5, '{"will":1}', NULL, 'humanist', '{"yoon_dahye":3}', FALSE, 0, FALSE, NULL, NULL, NULL),

-- Sub-1I: 연설 내용
('main_citizen', 'act1_sub1i', 0,
 '{"ko":"🕊️ 평화 호소 — 노래하자","en":"Peace appeal — let''s sing"}',
 '{"ko":"비폭력의 힘. 세계가 주목","en":"Power of nonviolence. The world watches"}',
 'act1_sub1i_result_a', 10, '{"public":3}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1i', 1,
 '{"ko":"🔥 저항 선언 — 몸으로 막자","en":"Resistance — stand in their way"}',
 '{"ko":"강렬하지만 군 긴장 고조","en":"Powerful but escalates military tension"}',
 'act1_sub1i_result_b', 10, '{"will":3}', NULL, 'radical', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act1_sub1i', 2,
 '{"ko":"📜 법적 논리 — 헌법을 읽겠다","en":"Legal argument — read the Constitution"}',
 '{"ko":"지식인층 결집. 차분한 힘","en":"Rally intellectuals. Quiet strength"}',
 'act1_sub1i_result_c', 10, '{"intel":2}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ Act 1 확장 시드 완료
-- 서브 분기: 4개 (Sub-1A, 1B, 1D, 1H, 1I = 5개)
-- 미니 이벤트: 10개 (ME1~ME10)
-- 랜덤 조우: 5개 (R1~R5)
-- 선택지: 14개


-- ====== 20260222_seed_act2.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — ACT 2 시나리오 데이터 시드
-- 대치 (01:30~04:00): 4분기점, 2 Choke Points
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ⭐ Choke Point 2: Protocol Zero 발동
('act2_choke2', 'main_citizen', 2, 'choke',
 '{"ko":"━━━ PROTOCOL ZERO ━━━\n\n정전.\n의회 건물이 칠흑 속에 잠긴다.\n스마트폰 — 신호 없음.\n인터넷 — 차단됨.\n유선전화 — 끊김.\n\n비상 발전기가 30초 후 켜진다.\n붉은 비상등만이 복도를 비춘다.\n\n건물 내부에는 현재:\n• 의원 47명 (정족수 151명 중)\n• 보좌관·경호원 약 30명\n• 경찰 20명 (오진석 청장 지휘)\n• 군 경비 12명 (장태호 직속)\n\n\"의사당은 이제 감옥이 되었소.\"\n백준서 총리가 중얼거린다.\n\n정족수까지 104명이 더 필요하다.\n바깥과 연락할 수 없다.\n시간은 흐르고 있다.","en":"PROTOCOL ZERO. Total blackout. The Assembly is now a prison. 47 lawmakers inside. 104 more needed for quorum. No communications."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 4: Protocol Zero 대응
('act2_bp4', 'main_citizen', 2, 'branch_main',
 '{"ko":"통신이 완전히 차단되었다. 바깥의 의원들을 소집하려면 먼저 연락 수단을 확보해야 한다.\n\n어떻게 바깥 세계와 연결하겠는가?","en":"Communications completely cut. How will you reconnect with the outside world?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP4 결과 노드
('act2_bp4_result_a', 'main_citizen', 2, 'story',
 '{"ko":"의회 지하 3층. 냉전 시대 벙커의 문을 열었다.\n\n먼지 쌓인 무전기들. 그런데... 하나가 작동한다.\n\n군 주파수를 청취할 수 있다. 그들의 작전이 전부 들린다.\n\n\"전차 3대가 Centris 남쪽으로 이동 중...\"\n\n[군 통신 청취 가능]","en":"In the Cold War bunker, you find a working radio. Military communications flood in — you can hear their entire operation."}',
 '{}', NULL, 30, '{"intel":3}', 'pragmatic'),

('act2_bp4_result_b', 'main_citizen', 2, 'story',
 '{"ko":"자원자 3명이 지하 터널을 통해 건물을 빠져나갔다.\n\n그들의 임무: 인근 의원들에게 직접 연락하여 소집.\n\n2시간 후 무전이 온다.\n\"30명 확보했습니다. 이동 중입니다.\"\n\n[2시간 후 의원 30명 합류 예정]","en":"Three volunteers escape through underground tunnels. Two hours later: \"30 lawmakers confirmed. En route.\""}',
 '{}', NULL, 20, '{"network":2}', 'humanist'),

('act2_bp4_result_c', 'main_citizen', 2, 'story',
 '{"ko":"47명의 의원들이 한 자리에 모였다.\n\n한세진이 말한다.\n\"바깥과 연락이 안 됩니다. 하지만 우리가 47명이면 비상 위원회를 구성할 수 있습니다.\"\n\n즉석 전략 회의. 역할 분담. 비상 행동 수칙.\n\n\"적어도 우리끼리는 단결합시다.\"\n\n[비상 위원회 결성]","en":"47 lawmakers form an emergency committee. You can''t reach outside, but you can organize those already here."}',
 '{}', NULL, 15, '{"will":1,"network":1}', 'righteous'),

('act2_bp4_result_d', 'main_citizen', 2, 'story',
 '{"ko":"Zero가 남겨둔 비상 채널.\n\n암호화된 메신저가 깜빡인다.\n\"차영은입니다. Firewall을 뚫었습니다. 외부 통신 복구까지 3분.\"\n\n3분 후, 의원 연락처로 일제히 문자가 나간다.\n\"Grand Assembly에서 긴급 소집. 한세진.\"\n\n[외부 통신 복구 — 대규모 소집 진행]","en":"Zero''s emergency channel activates. Within 3 minutes, mass texts go out to all lawmakers."}',
 '{"requires_act1_d":true}', NULL, 10, '{"intel":2,"network":3}', 'conspiring'),

-- BP5 도입부
('act2_pre_bp5', 'main_citizen', 2, 'story',
 '{"ko":"비서관이 달려온다.\n\n\"지도자님! 지하 1층에서... 누군가 군 주파수로 통신하고 있었습니다. 우리 위치와 인원을 외부에 보고하고 있었어요.\"\n\n침묵이 흐른다.\n건물 안에 스파이가 있다.","en":"Your aide rushes in. Someone inside has been transmitting your positions and numbers to the military on a hidden frequency."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 5: 배신자 색출
('act2_bp5', 'main_citizen', 2, 'branch_main',
 '{"ko":"건물 안에 스파이가 있다.\n\n이 사실이 퍼지면 의원들 사이에 불신이 퍼진다. 하지만 무시할 수도 없다.\n\n어떻게 대응하겠는가?","en":"There''s a spy inside. How do you handle it?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP5 결과 노드
('act2_bp5_result_a', 'main_citizen', 2, 'story',
 '{"ko":"전원 조사를 시작한다.\n\n\"모든 분의 통신 기기를 검사하겠습니다.\"\n\n반발이 거세다. 하지만 정보팀이 끈질기게 추적한다.\n\n40분 후.\n\"찾았습니다. 김보좌관입니다. 군 소속 위장 침투 요원이었습니다.\"\n\n김보좌관의 기기에서 군 작전 일부가 추출되었다.\n\n[배신자 색출 완료 + 군 작전 정보 일부 획득]","en":"You investigate everyone. After 40 minutes, you find the spy — a military plant disguised as a staff member."}',
 '{}', NULL, 40, '{"intel":2}', 'righteous'),

('act2_bp5_result_b', 'main_citizen', 2, 'story',
 '{"ko":"함정 수사를 실행한다.\n\n세 그룹에 서로 다른 거짓 작전을 전달한다.\nA그룹: \"우리는 동쪽 출구로 탈출한다\"\nB그룹: \"서쪽 지하도로 이동한다\"\nC그룹: \"옥상에서 헬기를 부른다\"\n\n20분 후, 군이 동쪽 출구에 병력을 배치한다.\n\n\"A그룹의 누군가입니다.\"\n\n[배신자 범위 축소 + 은신력 강화]","en":"You plant three different false plans with three groups. When the military moves to block the east exit, you narrow down the spy."}',
 '{}', NULL, 25, '{"stealth":2}', 'pragmatic'),

('act2_bp5_result_c', 'main_citizen', 2, 'story',
 '{"ko":"\"스파이가 있든 없든, 시간이 적이다.\"\n\n한세진이 단호하게 말한다.\n\"우리가 할 일은 정족수를 모으는 것입니다. 스파이 찾는 데 시간을 쓸 수 없습니다.\"\n\n의원들이 고개를 끄덕인다.\n하지만 불안한 시선이 오간다.\n\n[시간 절약 — 하지만 Act 3에서 배신자가 결정적 방해]","en":"\"Spy or not, time is our enemy.\" You press forward. But the spy will strike at the worst moment in Act 3."}',
 '{}', NULL, 5, '{"will":1}', 'radical'),

('act2_bp5_result_d', 'main_citizen', 2, 'story',
 '{"ko":"강무현에게 연락한다.\n\n\"정보부장이라면 스파이를 찾을 수 있지?\"\n\n강무현이 빠르게 행동한다.\n5분 만에 스파이를 색출한다. 놀라울 정도로 정확하게.\n\n하지만... 너무 빠르지 않은가?\n그가 처음부터 알고 있었다면?\n\n[즉시 배신자 색출 — 하지만 강무현의 의도가 불분명]","en":"Intelligence Director Kang finds the spy in 5 minutes. Suspiciously fast. Did he know all along?"}',
 '{}', NULL, 10, '{"intel":3}', 'conspiring'),

-- BP6 도입부
('act2_pre_bp6', 'main_citizen', 2, 'story',
 '{"ko":"서윤하 헌법재판관에게서 연락이 온다.\n\n\"40년간 법복을 입었습니다.\n이 판결이... 가장 무거운 판결이 될 것입니다.\n\n위헌 판결을 내리려면 Directive 6 원본에 대통령의 서명이 위조되었다는 증거가 필요합니다. 원본 문서를 구해야 합니다.\"\n\n증거가 필요하다. Directive 6를 무력화할 증거가.","en":"Judge Seo Yunha calls — 40 years in judicial robes, this her heaviest ruling. She needs proof that the president''s signature on Directive 6 was forged. You must find the original document."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 6: 결정적 증거
('act2_bp6', 'main_citizen', 2, 'branch_main',
 '{"ko":"Directive 6의 위헌성을 증명할 증거가 필요하다.\n\n서윤하가 위헌 판결을 내리기 위한 결정적 증거를 어떻게 확보하겠는가?","en":"You need decisive evidence to prove Directive 6 is unconstitutional. How will you obtain it?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP6 결과 노드
('act2_bp6_result_a', 'main_citizen', 2, 'story',
 '{"ko":"대통령 관저 The Pinnacle에 잠입 요원을 보냈다.\n\n긴장의 45분이 지난다.\n\n그리고... 팩스기가 울린다.\n\n원본 Directive 6.\n서명이 두 개.\n대통령의 서명 옆에... 강무현의 서명.\n\n이건 대통령 단독이 아니었다.\n\n[이중 서명 증거 확보]","en":"An operative infiltrates The Pinnacle. 45 minutes later, a fax arrives: the original Directive 6 with TWO signatures."}',
 '{}', NULL, 45, '{"intel":4}', 'righteous'),

('act2_bp6_result_b', 'main_citizen', 2, 'story',
 '{"ko":"디지털 포렌식 팀이 작업을 시작한다.\n\n정부 서버에 남은 Directive 6의 전자 서명 로그.\n\n\"서명 시간이 두 번입니다. 첫 번째가 23:45, 두 번째가 23:52.\"\n\n7분 간격. 같은 문서에 두 번째 서명.\n\n\"이건 공동 서명입니다. 대통령 혼자가 아닙니다.\"\n\n[디지털 증거 확보]","en":"Digital forensics reveals two signature timestamps 7 minutes apart. Co-signature confirmed."}',
 '{}', NULL, 30, '{"intel":2}', 'pragmatic'),

('act2_bp6_result_c', 'main_citizen', 2, 'story',
 '{"ko":"방송에 출연한다.\n\n사라 첸의 카메라 앞에서 한세진이 말한다.\n\"증거는 이미 우리 눈앞에 있습니다. 군 장갑차가 의회를 포위한 것 자체가 증거입니다. 하지만 세린 국민 여러분, 제가 묻고 싶은 것은 하나입니다 — 이것이 정상입니까?\"\n\n전 세계 시청자 앞에서 논리적으로 위헌성을 설명한다.\n\n30분 후, 외국 정부들이 성명을 발표한다.\n\"Veridian의 계엄에 깊은 우려를 표명한다.\"\n\n[여론전 승리 — 국제 압력 확보]","en":"You make the case on live TV. Within 30 minutes, foreign governments issue statements of concern."}',
 '{}', NULL, 35, '{"public":3}', 'humanist'),

('act2_bp6_result_d', 'main_citizen', 2, 'story',
 '{"ko":"Sentinel 네트워크가 활성화된다.\n\n화면에 문서가 쏟아진다.\nDirective 6 원본. 이중 서명. 비자금 경로. 해외 계좌.\n\n강무현이 속삭인다.\n\"이게 전부야. 이걸로 끝낼 수 있어.\"\n\n[모든 증거 일괄 확보 — Sentinel 최종 단계]","en":"The Sentinel network dumps everything: Directive 6, dual signatures, slush funds, offshore accounts."}',
 '{"requires_sentinel":true}', NULL, 15, '{"intel":6}', 'conspiring'),

-- BP7 도입부
('act2_pre_bp7', 'main_citizen', 2, 'story',
 '{"ko":"시간: 약 02:30:00 남음\n\n의회 건물 안에서 분열이 시작된다.\n의원 15명이 \"군부와 협상하자\"고 주장한다.\n경찰 일부가 군부 쪽으로 넘어간다.\n\n오진석이 보고한다:\n\"제 부하 중 8명이... 군복을 입었습니다. 우리 경찰 병력이 절반으로 줄었습니다.\"","en":"Fractures appear. 15 lawmakers push for negotiation with the military. Police officers defect."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 7: 동맹 재편
('act2_bp7', 'main_citizen', 2, 'branch_main',
 '{"ko":"중간 진영이 갈라서고 있다. 의원 15명이 군부와의 타협을 주장하며, 경찰 병력은 절반으로 줄었다.\n\n어떻게 대응하겠는가?","en":"The alliance is fracturing. 15 lawmakers push for military negotiations, and half your police have defected."}',
 '{}', NULL, 5, NULL, NULL),

-- BP7 결과 노드
('act2_bp7_result_a', 'main_citizen', 2, 'story',
 '{"ko":"\"알겠소. 당신들의 조건을 듣겠소.\"\n\n이탈파 대표와 조건을 논의한다.\n군부에 대한 면책. 일부 권한 양보. 쓴 약이다.\n\n하지만 15명이 복귀하면 정족수에 한 걸음 더 가까워진다.\n\n\"...이건 타협입니다. 패배가 아닙니다.\"\n\n[이탈파 복귀 — 하지만 Act 3에서 타협의 대가]","en":"You negotiate with the defectors. Bitter concessions, but 15 lawmakers return."}',
 '{}', NULL, 25, '{"network":3,"will":-2}', 'pragmatic'),

('act2_bp7_result_b', 'main_citizen', 2, 'story',
 '{"ko":"한세진이 단상에 오른다.\n\n\"한 가지만 여쭤봐도 됩니까?\"\n\n목소리가 오히려 낮아진다.\n\n\"여기서 나가시면...\n내일 아침 거울을 볼 수 있겠습니까?\n\n저는 솔직히, 자신이 없습니다.\n하지만 여기 남으면 최소한 시도는 한 겁니다.\"\n\n잠깐 웃는다.\n\n\"참고로, 이 건물 커피가 의외로 괜찮습니다.\n적어도 한 잔 더 하시고 결정하시죠.\"\n\n웃음이 번진다. 이탈파 중 3명이 자리로 돌아온다.\n\n[설득 연설 성공 — 이탈파 20% 복귀]","en":"\Han takes the podium, voice dropping lower. \"Can you look in the mirror tomorrow if you walk out?\" A pause, then a smile: \"The coffee here is surprisingly decent. Stay for one more cup.\" 3 defectors return."}',
 '{}', NULL, 15, '{"will":2,"public":2}', 'righteous'),

('act2_bp7_result_c', 'main_citizen', 2, 'story',
 '{"ko":"\"의원 정족수가 안 되면, 시민이 대신 말할 것입니다.\"\n\n건물 1층 로비를 개방한다.\n밖에서 기다리던 시민들이 들어온다.\n\n\"우리가 여기 있습니다!\" 함성이 울린다.\n\n분위기가 반전된다. 이탈파도 눈치를 본다.\n하지만 장태호가 \"폭도 진입\"으로 규정할 위험이...\n\n[시민 유입 — 분위기 반전, 하지만 군부 구실 제공]","en":"You open the lobby to citizens. The mood shifts dramatically, but the military may call it a \"mob incursion.\""}',
 '{}', NULL, 20, '{"will":1,"network":2}', 'humanist'),

('act2_bp7_result_d', 'main_citizen', 2, 'story',
 '{"ko":"이탈파 리더 최의원.\n\n그의 해외 은닉 재산 자료를 테이블에 올려놓는다.\n\n\"... 협상하시겠습니까, 최 의원?\"\n\n최 의원의 얼굴이 하얗게 질린다.\n5분 후, 이탈파 전원이 복귀한다.\n\n[즉시 이탈파 복귀 — 하지만 \"더러운 정치\" 태그]","en":"You lay the defector leader''s offshore assets on the table. \"Shall we negotiate?\" All 15 return immediately."}',
 '{}', NULL, 10, '{"network":2}', 'cold_blood'),

-- ⭐ Choke Point 3: The Quorum 준비
('act2_choke3', 'main_citizen', 2, 'choke',
 '{"ko":"━━━ THE QUORUM ━━━\n\n의원 총집계가 계속된다.\n결정적 순간이 다가온다.\n\n그때, 건물 정문 너머에서 소리가 들린다.\n장갑차의 엔진 소리.\n\n시계를 본다. 예상보다 일찍 왔다.\n\nRed Dawn. 군부의 최종 작전이 시작되었다.\n\n\"위원장님, 시간이 없습니다.\"\n\n━━━ ACT 3: 결전 시작 ━━━","en":"THE QUORUM count continues. Then — armored vehicles. Red Dawn has begun. ACT 3: THE FINAL STAND."}',
 '{}', NULL, 5, NULL, NULL),

-- Act 2 실패 노드
('act2_fail_chaos', 'main_citizen', 2, 'ending',
 '{"ko":"의회 내부가 완전히 붕괴했다.\n\n의원들이 서로 고성을 지른다. 경찰이 이탈한다. 배신자의 정보가 군에 도달했다.\n\n장태호가 통보한다.\n\"의회는 자체적으로 기능을 상실했습니다. 우리가 질서를 회복합니다.\"\n\n[내부 붕괴 엔딩]\n[영구 해금: 의회 정치 역학 파악]","en":"The Assembly collapses from within. Internal chaos gives the military justification to intervene."}',
 '{"title":{"ko":"무너진 성","en":"The Fallen Fortress"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── ACT 2 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- 분기점 4: Protocol Zero 대응
('main_citizen', 'act2_bp4', 0,
 '{"ko":"📻 의회 지하 벙커의 비상 무전기 탐색","en":"Search for emergency radios in the Cold War bunker"}',
 '{"ko":"냉전 시대에 만든 게 아직 있을 것이다","en":"There must be something left from the Cold War era"}',
 'act2_bp4_result_a', 30, '{"intel":3}', '{"intel":{"min":3}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'intel', 3, 'act2_choke3'),

('main_citizen', 'act2_bp4', 1,
 '{"ko":"🏃 자원자를 내보내 의원들을 소집","en":"Send volunteers to summon lawmakers"}',
 '{"ko":"누군가는 이 건물을 나가야 한다","en":"Someone needs to leave this building"}',
 'act2_bp4_result_b', 20, '{"network":2}', '{"network":{"min":4}}', 'humanist', NULL, FALSE, 0, TRUE, 'network', 4, 'act2_choke3'),

('main_citizen', 'act2_bp4', 2,
 '{"ko":"💡 건물 내 의원들만으로 전략 수립","en":"Strategize with the 47 lawmakers present"}',
 '{"ko":"47명으로 할 수 있는 일부터 하자","en":"Let''s start with what we can do with 47"}',
 'act2_bp4_result_c', 15, '{"will":1,"network":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_bp4', 3,
 '{"ko":"🔒 Zero의 비상 채널 활성화","en":"Activate Zero''s emergency channel"}',
 '{"ko":"Firewall을 뚫을 수 있는 건 Zero뿐이다","en":"Only Zero can break through the firewall"}',
 'act2_bp4_result_d', 10, '{"intel":2,"network":3}', NULL, 'conspiring', NULL, TRUE, 90, FALSE, NULL, NULL, NULL),

-- BP4 결과 → BP5 연결
('main_citizen', 'act2_bp4_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp4_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp4_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp4_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도입부 → BP5
('main_citizen', 'act2_pre_bp5', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 5: 배신자 색출
('main_citizen', 'act2_bp5', 0,
 '{"ko":"🔍 전원 조사 — 보안 심문","en":"Full investigation — security interrogation"}',
 '{"ko":"지금 당장 모두의 통신 기록을 확인한다","en":"Check everyone''s communication records immediately"}',
 'act2_bp5_result_a', 40, '{"intel":2}', '{"intel":{"min":5}}', 'righteous', NULL, FALSE, 0, TRUE, 'intel', 5, 'act2_fail_chaos'),

('main_citizen', 'act2_bp5', 1,
 '{"ko":"🎭 함정 수사 — 거짓 정보 흘리기","en":"Sting operation — plant false information"}',
 '{"ko":"세 그룹에 다른 거짓 작전을 알려주자","en":"Give three groups three different fake plans"}',
 'act2_bp5_result_b', 25, '{"stealth":2}', '{"stealth":{"min":4}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'stealth', 4, 'act2_fail_chaos'),

('main_citizen', 'act2_bp5', 2,
 '{"ko":"📢 무시하고 전진 — 시간이 없다","en":"Ignore it and press forward — no time"}',
 '{"ko":"스파이가 있든 없든, 시간이 적이다","en":"Spy or not, time is our enemy"}',
 'act2_bp5_result_c', 5, '{"will":1}', NULL, 'radical', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_bp5', 3,
 '{"ko":"🕵️ 강무현의 조언을 구한다","en":"Consult Intelligence Director Kang"}',
 '{"ko":"정보부장이라면 스파이를 찾을 수 있다","en":"The intelligence chief can find the spy"}',
 'act2_bp5_result_d', 10, '{"intel":3}', NULL, 'conspiring', '{"kang_muhyun":1}', TRUE, 100, FALSE, NULL, NULL, NULL),

-- BP5 결과 → BP6 연결
('main_citizen', 'act2_bp5_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp5_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp5_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp5_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도입부 → BP6
('main_citizen', 'act2_pre_bp6', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 6: 결정적 증거
('main_citizen', 'act2_bp6', 0,
 '{"ko":"🏛️ The Pinnacle에 잠입 요원 파견","en":"Send an operative to The Pinnacle"}',
 '{"ko":"비서실에 원본이 있을 것이다","en":"The original must be in the presidential office"}',
 'act2_bp6_result_a', 45, '{"intel":4}', '{"network":{"min":5}}', 'righteous', NULL, FALSE, 0, TRUE, 'network', 5, 'act2_choke3'),

('main_citizen', 'act2_bp6', 1,
 '{"ko":"💻 디지털 포렌식 증거 수집","en":"Collect digital forensic evidence"}',
 '{"ko":"전자 서명에 조작 흔적이 있을 것이다","en":"There must be tampering traces in the digital signatures"}',
 'act2_bp6_result_b', 30, '{"intel":2}', '{"intel":{"min":6}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'intel', 6, 'act2_choke3'),

('main_citizen', 'act2_bp6', 2,
 '{"ko":"🎤 TV 토론으로 여론전 승부","en":"Win through a TV debate"}',
 '{"ko":"증거가 없어도 국민이 판단할 것이다","en":"Even without evidence, the people will judge"}',
 'act2_bp6_result_c', 35, '{"public":3}', '{"public":{"min":7}}', 'humanist', '{"sarah_chen":2}', FALSE, 0, TRUE, 'public', 7, 'act2_choke3'),

('main_citizen', 'act2_bp6', 3,
 '{"ko":"🔑 Sentinel 네트워크 접속","en":"Access the Sentinel network"}',
 '{"ko":"내부 고발자 네트워크가 답이다","en":"The whistleblower network is the answer"}',
 'act2_bp6_result_d', 15, '{"intel":6}', NULL, 'conspiring', '{"kang_muhyun":2}', TRUE, 120, FALSE, NULL, NULL, NULL),

-- BP6 결과 → BP7 연결
('main_citizen', 'act2_bp6_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp6_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp6_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp6_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act2_pre_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도입부 → BP7
('main_citizen', 'act2_pre_bp7', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 7: 동맹 재편
('main_citizen', 'act2_bp7', 0,
 '{"ko":"🤝 이탈파와 타협한다","en":"Compromise with the defectors"}',
 '{"ko":"조건을 일부 수용하더라도 정족수가 먼저다","en":"Accept some conditions — quorum comes first"}',
 'act2_bp7_result_a', 25, '{"network":3,"will":-2}', NULL, 'pragmatic', '{"baek_junseo":1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_bp7', 1,
 '{"ko":"⚡ 설득 연설로 결집","en":"Rally everyone with a passionate speech"}',
 '{"ko":"거울을 볼 수 있겠습니까? 남아서 시도라도 합시다","en":"Can you look in the mirror tomorrow? Stay and at least try"}',
 'act2_bp7_result_b', 15, '{"will":2,"public":2}', '{"will":{"min":7}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'will', 7, 'act2_fail_chaos'),

('main_citizen', 'act2_bp7', 2,
 '{"ko":"📱 시민 세력을 건물 안으로 유입","en":"Bring citizen forces inside the building"}',
 '{"ko":"시민 청원으로 압력을 넣어야 한다","en":"We need citizen pressure"}',
 'act2_bp7_result_c', 20, '{"will":1,"network":2}', '{"public":{"min":6}}', 'humanist', '{"yoon_dahye":2}', FALSE, 0, TRUE, 'public', 6, 'act2_choke3'),

('main_citizen', 'act2_bp7', 3,
 '{"ko":"🕵️ 이탈파 리더를 표적 설득","en":"Target the defector leader with leverage"}',
 '{"ko":"그의 약점을 알고 있다... 사용할까?","en":"I know his weakness... should I use it?"}',
 'act2_bp7_result_d', 10, '{"network":2}', NULL, 'cold_blood', NULL, TRUE, 100, FALSE, NULL, NULL, NULL),

-- BP7 결과 → Choke Point 3 연결
('main_citizen', 'act2_bp7_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_choke3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp7_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_choke3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp7_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_choke3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act2_bp7_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act2_choke3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ ACT 2 시나리오 시드 완료


-- ====== 20260222_seed_act2_expanded.sql ======
-- ═══════════════════════════════════════════════════
-- 6 Hours v2 — ACT 2 확장 시드
-- 서브 분기점 + CP-Mid + 미니 이벤트 + 랜덤 조우
-- ═══════════════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ── CP-Mid: 자정의 분수령 (02:30 — 신규 Choke Point) ──
('act2_cp_mid', 'main_citizen', 2, 'choke',
 '{"ko":"━━━ 02:30 — 자정의 분수령 ━━━\n\n시간은 정확히 절반이 지났다.\n3시간 소비. 3시간 남음.\n\n현재 상황 정리:\n• 정족수: [현재 의원 수] / 151명\n• 통신: [복구 여부]\n• 증거: [확보 여부]\n• 군 동태: [Red Dawn까지 예상 시간]\n\n한세진이 화이트보드 앞에 선다.\n\n\"지금까지 한 일을 정리하자.\n그리고 남은 3시간을 어떻게 쓸지 결정하자.\"\n\n━━━ 방향 재설정 ━━━","en":"━━━ 02:30 — The Midnight Watershed ━━━\nHalf the time is gone. Status review: quorum count, communications, evidence, military. ''Let''s decide how to use our remaining 3 hours.''"}',
 '{"choke_type":"mid_checkpoint"}', NULL, 5, NULL, NULL),

-- ── Sub-4A: 통신 장비 상태 확인 ──
('act2_sub4a', 'main_citizen', 2, 'branch_sub',
 '{"ko":"냉전 벙커의 통신 장비들.\n먼지 속에서 깜빡이는 LED 하나.\n\n\"이걸 살릴 수 있을까?\"","en":"Old bunker communications. A blinking LED in the dust. ''Can we revive this?''"}',
 '{}', NULL, 5, NULL, NULL),

('act2_sub4a_result_a', 'main_citizen', 2, 'story',
 '{"ko":"직접 수리를 시작한다.\n\n배선을 분리하고,\n납땜이 벗겨진 부분을 다시 잇고,\n안테나를 창문으로 빼낸다.\n\n30분 후.\n노이즈 속에서 군 통신이 잡힌다.\n\n\"...Red Dawn은 04:00에 개시...\"\n\n[직접 수리 — 정보+2, 시간 30분 소비]","en":"You repair it yourself. 30 minutes later, military comms come through: ''Red Dawn commences at 04:00.''"}',
 '{}', NULL, 30, '{"intel":2}', 'pragmatic'),

('act2_sub4a_result_b', 'main_citizen', 2, 'story',
 '{"ko":"보좌관 중 전자공학 전공자를 찾는다.\n\n최보좌관. 대학에서 무선통신을 전공했다.\n\n\"이건 구형이지만 원리는 같습니다.\n20분이면 됩니다.\"\n\n최보좌관이 능숙하게 장비를 살린다.\n\n\"AM 주파수 복구 완료.\n추가로 FM도 가능합니다.\"\n\n[전문가 수리 — 정보+1, 통신 품질 우수]","en":"You find a comms-specialized aide. 20 minutes later: ''AM and FM restored. Better than I expected.''"}',
 '{}', NULL, 20, '{"intel":1}', 'pragmatic'),

-- ── Sub-5A: 용의자 좁히기 (배신자 색출 심화) ──
('act2_sub5a', 'main_citizen', 2, 'branch_sub',
 '{"ko":"배신자가 있다는 건 확실하다.\n어떤 방법으로 찾을 것인가?","en":"There''s definitely a spy. How will you narrow down the suspects?"}',
 '{}', NULL, 5, NULL, NULL),

('act2_sub5a_result_a', 'main_citizen', 2, 'story',
 '{"ko":"CCTV를 확인한다.\n\n의회 건물 내 카메라 32대.\n비상 전원으로 4대만 작동 중.\n\nBut those 4 are enough.\n\n복도 카메라에 찍힌 인물.\n밤 1시 47분, 화장실로 향하는 한 사람.\n스마트폰을 숨기듯 들고 있다.\n\n\"저 사람입니다. 김 보좌관.\"","en":"CCTV review: 4 cameras operational. At 1:47 AM, someone heading to the bathroom, hiding a phone. ''That''s aide Kim.''"}',
 '{}', NULL, 20, '{"intel":1}', 'righteous'),

('act2_sub5a_result_b', 'main_citizen', 2, 'story',
 '{"ko":"증언을 수집한다.\n\n의원 한 명이 말한다.\n\"이상했어요. 김 보좌관이\n아까 전화 통화하는 걸 봤는데...\n통신이 다 끊겼잖아요.\n근데 통화가 되고 있었어요.\"\n\n군용 위성전화.\n\n[증언 확보 — 용의자 특정]","en":"A lawmaker reports: ''Aide Kim was making a call earlier... but all communications are down. He had a satellite phone.''"}',
 '{}', NULL, 15, '{"intel":1}', 'righteous'),

('act2_sub5a_result_c', 'main_citizen', 2, 'story',
 '{"ko":"통신 기록을 대조한다.\n\n벙커 무전기로 잡히는 군 주파수와\n의회 내부에서 발신되는 신호의\n타이밍을 비교한다.\n\n\"발신 시간: 1:47, 2:15, 2:33\n잠깐... 이 신호, 화장실 방향에서 나옵니다.\"\n\n삼각측량으로 위치까지 좁혔다.\n\n[통신 분석 — 정보+2, 정확한 위치 특정]","en":"Cross-referencing signal timestamps and triangulating: the transmission comes from the bathroom area. Times: 1:47, 2:15, 2:33."}',
 '{}', NULL, 25, '{"intel":2}', 'pragmatic'),

-- ── Sub-5B: 심문 방식 ──
('act2_sub5b', 'main_citizen', 2, 'branch_sub',
 '{"ko":"김 보좌관을 잡았다.\n\n그는 얼굴이 창백하다.\n\"아, 아닙니다. 오해입니다...\"\n\n어떻게 심문할 것인가?","en":"You''ve caught aide Kim. His face is pale. ''No, it''s a misunderstanding...'' How do you interrogate?"}',
 '{}', NULL, 5, NULL, NULL),

('act2_sub5b_result_a', 'main_citizen', 2, 'story',
 '{"ko":"한세진이 의자를 당겨 앉는다.\n\n\"김 보좌관. 가족이 있지?\"\n\n\"...네. 아내와 아들이...\"\n\n\"나도 있어.\n오늘 밤 집을 나오면서\n아이 이마에 입술을 댔지.\"\n\n침묵.\n\n\"당신은 왜 여기 왔어?\n정말로 나쁜 사람인 거야?\"\n\n김 보좌관의 눈에서 눈물이 떨어진다.\n\n\"...가족을 볼모로 잡혔습니다.\n관저에서 전화가 왔어요.\n여자 목소리... VIP0라고 했습니다.\"\n\n[부드러운 대화 — 배후 정보 획득 + 도덕적 승리]","en":"You sit close and ask gently about his family. He breaks down: ''They''re holding my family hostage. A woman called from The Pinnacle — VIP0.''"}',
 '{}', NULL, 15, '{"intel":3}', 'humanist'),

('act2_sub5b_result_b', 'main_citizen', 2, 'story',
 '{"ko":"\"증거는 다 있습니다.\nCCTV, 통신 기록, 증인.\n부인할 수 없습니다.\"\n\n한세진이 종이를 내밀었다.\n\n\"자백서를 쓰시오.\n누가 당신을 보냈는지,\n무엇을 보고했는지.\"\n\n김 보좌관의 손이 떨리며 펜을 잡는다.\n\n\"...강무현 정보부장의 지시입니다.\n하지만... 강무현도 누군가에게 보고합니다.\n퇴역 정보사 장군... 이름은 모릅니다.\"\n\n[직접 추궁 — 자백서 확보]","en":"You present all evidence and demand a written confession. Trembling, he writes: ''Under orders from Intelligence Director Kang.''"}',
 '{}', NULL, 10, '{"intel":2}', 'righteous'),

('act2_sub5b_result_c', 'main_citizen', 2, 'story',
 '{"ko":"군 위성전화를 테이블에 올려놓는다.\n\n\"이것으로 군에 보고하고 있었죠?\"\n\n김 보좌관이 멈칫한다.\n\n\"이 전화기의 통화 기록을\n이미 추출했습니다.\n마지막 통화: The Pinnacle.\n통화 시간: 7분.\n\n무슨 얘기를 했습니까?\"\n\n\"...의원들의 이동 경로와\n정족수 확보 진행 상황을요.\"\n\n[증거 제시 — 정보+2, 빠른 자백]","en":"You place the satellite phone on the table. ''Call records extracted. Last call: The Pinnacle. 7 minutes. What did you discuss?'' He confesses: movement routes and quorum progress."}',
 '{}', NULL, 10, '{"intel":2}', 'pragmatic'),

-- ── Sub-5C: 배신자 처리 ──
('act2_sub5c', 'main_citizen', 2, 'branch_sub',
 '{"ko":"김 보좌관의 자백을 얻었다.\n이제 어떻게 처리할 것인가?\n\n47명의 의원들이 지켜보고 있다.","en":"You have his confession. What now? 47 lawmakers are watching."}',
 '{}', NULL, 5, NULL, NULL),

('act2_sub5c_result_a', 'main_citizen', 2, 'story',
 '{"ko":"지하실에 감금한다.\n\n\"미안하게 됐습니다, 김 보좌관.\n하지만 이해하시겠죠.\"\n\n김 보좌관이 고개를 끄덕인다.\n\"...네. 알겠습니다.\"\n\n의원들이 안심한다.\n\"배신자를 찾았으니 이제 좀 낫겠지.\"\n\n[감금 — 안전 확보, 의원 사기 회복]","en":"You lock him in the basement. ''I understand,'' he nods. The lawmakers breathe easier."}',
 '{}', NULL, 5, '{"will":1}', 'righteous'),

('act2_sub5c_result_b', 'main_citizen', 2, 'story',
 '{"ko":"\"김 보좌관, 한 가지 제안이 있습니다.\"\n\n\"군에 거짓 정보를 보내주시오.\n우리 편인 척 하면서.\"\n\n김 보좌관의 눈이 커진다.\n\"...이중 스파이요?\"\n\n\"가족을 구할 수도 있습니다.\n군이 승리한다고 믿게 만들면.\"\n\n[이중 스파이 활용 — 정보+3, 리스크 존재]","en":"''Send false intel to the military. Pretend you''re still on their side. This might save your family too.'' Double agent activated."}',
 '{}', NULL, 5, '{"intel":3}', 'conspiring'),

('act2_sub5c_result_c', 'main_citizen', 2, 'story',
 '{"ko":"\"모든 의원 앞에서 공개합니다.\"\n\n한세진이 김 보좌관을 본회의장으로 데려간다.\n\n\"여러분, 이 사람이 배신자입니다.\n하지만 그는 가족을 볼모로 잡힌 피해자기도 합니다.\"\n\n\"여러분이 앞으로 보는 모든 사람을\n의심하게 되더라도,\n우리는 투명해야 합니다.\"\n\n의원들이 술렁인다.\n불안하지만... 신뢰가 생긴다.\n\n[공개 처벌 — 의지+2, 하지만 불안감 증가]","en":"You bring him before all lawmakers. ''He''s a spy, but also a victim. His family was threatened. We must be transparent.'' Unsettling, but trust deepens."}',
 '{}', NULL, 10, '{"will":2}', 'righteous'),

-- ── Sub-6A: 증거 수집 작전 세부 ──
('act2_sub6a', 'main_citizen', 2, 'branch_sub',
 '{"ko":"Directive 6 원본을 확보해야 한다.\nThe Pinnacle (대통령 관저)에서.\n\n작전 팀을 어떻게 구성할 것인가?","en":"You need the original Directive 6 from The Pinnacle. How do you organize the retrieval team?"}',
 '{}', NULL, 5, NULL, NULL),

('act2_sub6a_result_a', 'main_citizen', 2, 'story',
 '{"ko":"3인 1조.\n\n오진석 경찰관 1명 (호위)\n비서관 1명 (문서 확인 전문)\n차영은이 원격 지원 (보안 시스템 해킹)\n\n역할 분담이 명확하다.\n실패 확률이 낮다.\n\n[정예 팀 구성 — 안정적 작전]","en":"Three-person team: police escort, document expert, Zero for remote hacking support. Clear roles, low failure probability."}',
 '{}', NULL, 10, '{"intel":1}', 'pragmatic'),

('act2_sub6a_result_b', 'main_citizen', 2, 'story',
 '{"ko":"한세진이 직접 간다.\n\n\"내가 가면 경비가 잠시 멈칠 겁니다.\n국회의원이니까.\"\n\n비서관이 만류한다.\n\"위험합니다, 지도자님!\"\n\n\"위험하지 않은 일이 오늘 밤에 있었나?\"\n\n[단독 행동 — 리스크 높지만 의지+2]","en":"You go yourself. ''They''ll hesitate to stop a congressman.'' — ''Was anything tonight NOT dangerous?'' High risk, high resolve."}',
 '{}', NULL, 5, '{"will":2}', 'righteous'),

('act2_sub6a_result_c', 'main_citizen', 2, 'story',
 '{"ko":"차영은에게 전부 맡긴다.\n\n\"관저 보안 시스템에 접속해서\n문서 서버에 있는 Directive 6 원본을\n원격으로 추출할 수 있어요?\"\n\n\"...30분 주세요.\n방화벽이 세 겹이에요.\"\n\n[원격 작전 — 인력 위험 없으나 시간 소요]","en":"Zero handles it remotely. ''Three firewalls. Give me 30 minutes.'' No personnel risk, but time-consuming."}',
 '{}', NULL, 30, '{"intel":2}', 'conspiring')

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 미니 이벤트
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ME11: Protocol Zero 직후 공포
('act2_mini_blackout_fear', 'main_citizen', 2, 'mini_event',
 '{"ko":"정전.\n\n30초가 영원 같다.\n\n누군가 비명을 지른다.\n의자가 넘어가는 소리.\n\n\"괜찮습니다! 진정하십시오!\"\n한세진의 목소리가 어둠을 가른다.\n\n비상 발전기가 켜진다.\n붉은 빛이 얼굴들을 비춘다.\n\n공포에 질린 눈.\n분노에 타오르는 눈.\n체념한 눈.\n\n47개의 얼굴에 47가지 감정.","en":"Blackout. 30 seconds of eternity. Screams. Then emergency generators kick in. Red light reveals 47 faces with 47 different emotions."}',
 '{"atmosphere":"blackout_terror"}', NULL, 2, NULL, NULL),

-- ME12: 외부 시민 통신
('act2_mini_citizen_voices', 'main_citizen', 2, 'mini_event',
 '{"ko":"복구된 무전기에서\n시민들의 목소리가 들린다.\n\n\"여보세요? 여기 Centris 5구역입니다.\n우리 30명이 모여 있어요.\n어디로 가야 하나요?\"\n\n\"여기 대학교 캠퍼스!\n학생 200명이 준비 됐어요!\n불을 끄고 기다리고 있어요!\"\n\n\"지도자님... 우리가 있습니다.\n혼자가 아닙니다.\"\n\n한세진의 눈이 뜨거워진다.","en":"Restored radio picks up citizen voices: ''30 of us in District 5,'' ''200 students ready at the campus,'' ''You''re not alone, Leader.'' Tears well in your eyes."}',
 '{"atmosphere":"solidarity"}', NULL, 3, NULL, NULL),

-- ME13: 배신자 발각 직후 분위기
('act2_mini_post_spy', 'main_citizen', 2, 'mini_event',
 '{"ko":"배신자가 색출된 후.\n\n의원들이 서로를 바라본다.\n눈에 안 보이던 벽이 세워진다.\n\n\"...혹시 또 있는 거 아니야?\"\n\n옆에 앉은 사람의 커핑 소리에도\n움찔하는 의원이 있다.\n\n신뢰가 금이 갔다.\n그리고 금이 간 신뢰는\n붙여도 흔적이 남는다.","en":"After the spy is caught, invisible walls go up between lawmakers. Every cough makes someone flinch. Trust has cracked. Even mended, the scar remains."}',
 '{"atmosphere":"paranoia"}', NULL, 2, NULL, NULL),

-- ME14: 서윤하의 전화 (표정)
('act2_mini_judge_call', 'main_citizen', 2, 'mini_event',
 '{"ko":"서윤하 재판관과의 통화.\n\n그녀의 목소리에서 떨림이 느껴진다.\n\n\"한 지도자님...\n저도 하고 싶습니다.\n하지만... 제 남편이 지금\n정보부에 끌려가 있습니다.\"\n\n\"...알고 있었습니까?\"\n\n\"오늘 아침에 연락이 끊겼어요.\n위헌 판결을 내리면\n남편이 어떻게 될지...\"\n\n긴 침묵.\n\n\"그래도... 하겠습니다.\n40년 동안 한 번도...\n법복이 이렇게 무거웠던 적은 없었습니다.\n\n이것이 제가 재판관인 이유이니까요.\"","en":"Judge Seo''s voice trembles: ''My husband was taken by intelligence this morning. If I rule unconstitutional... I don''t know what they''ll do to him. But I''ll do it. In 40 years, my robes never felt this heavy. That''s why I''m a judge.''"}',
 '{"atmosphere":"sacrifice"}', NULL, 3, NULL, NULL),

-- ME15: 자정의 커피
('act2_mini_midnight_coffee', 'main_citizen', 2, 'mini_event',
 '{"ko":"자정이 지났다.\n\n누군가가 커피를 끓였다.\n의원 식당의 마지막 커피 한 봉지.\n\n47명이 한 잔씩 나눠 마신다.\n반 잔도 안 된다.\n\n하지만 따뜻하다.\n\n\"이게 오늘 밤 마지막 커피일 수도 있지.\"\n\n누군가가 웃는다.\n그 웃음이 전염된다.\n\n잠깐이나마, 사람들이 웃었다.","en":"Past midnight. Someone brews the last coffee. Half a cup each for 47 people. Warm. ''Might be our last coffee tonight.'' Someone laughs. It spreads. For a moment, people smile."}',
 '{"atmosphere":"human_moment"}', NULL, 2, NULL, NULL),

-- ME16: 동맹 균열 조짐
('act2_mini_fracture_signs', 'main_citizen', 2, 'mini_event',
 '{"ko":"비서관이 속삭인다.\n\n\"지도자님, 박 의원과 이 의원이\n화장실에서 15분째 나오지 않습니다.\"\n\n\"뭘 하고 있는 거야?\"\n\n\"제 추측으로는...\n군부와 직접 협상을 시도하는 것 같습니다.\n자신들의 안전을 보장받으려고.\"\n\n한세진의 표정이 굳는다.\n\n\"여기 있는 47명 전부가\n한마음은 아니라는 거군.\"","en":"Your aide whispers: ''Park and Lee have been in the bathroom for 15 minutes. I think they''re negotiating directly with the military for their own safety.'' Not everyone here is on the same side."}',
 '{"atmosphere":"internal_threat"}', NULL, 2, NULL, NULL),

-- ME17: 해외 반응 속보
('act2_mini_international', 'main_citizen', 2, 'mini_event',
 '{"ko":"사라 첸의 메시지:\n\n\"한 지도자님, 해외 반응 전달드립니다.\n\n🇺🇸 미국 국무부: ''Veridian 상황을 주시 중''\n🇪🇺 EU: ''민주적 절차 회복을 촉구''\n🇯🇵 일본: ''깊은 우려 표명''\n🇨🇳 중국: ''내정 불간섭 원칙''\n\n아직 제재까지는 안 갔어요.\n하지만 CNN 생중계가 시작되면\n흐름이 바뀔 수 있습니다.\"\n\n세계가 지켜보고 있다.\n아직은... 지켜보기만.","en":"Sarah Chen relays: US ''monitoring,'' EU ''urges restoration,'' Japan ''deep concern,'' China ''non-interference.'' No sanctions yet. But if CNN goes live, things could change."}',
 '{"atmosphere":"international_pressure"}', NULL, 2, NULL, NULL),

-- ME18: 장태호의 고뇌 (간접 묘사)
('act2_mini_jang_hesitation', 'main_citizen', 2, 'mini_event',
 '{"ko":"군 무전에서 이상한 대화가 잡힌다.\n\n참모: \"사령관, Red Dawn 준비 완료.\"\n장태호: \"...\"\n참모: \"사령관?\"\n장태호: \"...아들 이수빈. 지금 어디 있지?\"\n참모: \"확인 중입니다.\"\n장태호: \"찾아. Red Dawn 전에 찾아.\n내 아들이 거기 있으면 안 돼.\"\n\n한세진이 중얼거린다.\n\"...사령관에게도 약점이 있군.\"","en":"Intercepted: Jang asks his staff to locate his son before Red Dawn. ''He can''t be in that building when we go in.'' The general has a weakness too."}',
 '{"atmosphere":"enemy_human"}', NULL, 2, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 랜덤 조우
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag, encounter_weight, encounter_max) VALUES

-- R6: 통신 장비 과부하
('act2_random_comms_overload', 'main_citizen', 2, 'random_encounter',
 '{"ko":"복구된 무전기가 과열된다.\n\n\"연기가 나요!\"\n\n급히 전원을 뽑았다.\n\n10분 후 다시 시도하면...\n도청되고 있던 군 주파수에서\n전혀 다른 정보가 들린다.\n\n\"The Pinnacle에서 문서 파기 시작.\nVIP0 지시.\"\n\n[정보+2 — 관저에서 증거 인멸 중]","en":"Radio overheats. After 10 minutes restart, you intercept: ''Document shredding underway at The Pinnacle. VIP0 orders.''"}',
 '{"encounter_pool":"act2"}',
 NULL, 10, '{"intel":2}', NULL, 0.5, 1),

-- R7: 적 역추적
('act2_random_trace', 'main_citizen', 2, 'random_encounter',
 '{"ko":"차영은이 경고한다.\n\n\"한 지도자님, 제 해킹이 역추적 당하고 있어요.\n정보부 사이버 부대예요.\n\n지금 당장 이 라인을 끊지 않으면\n우리 위치가 노출됩니다.\"\n\n[은신 체크 — 실패 시 군 경계 강화]","en":"Zero warns: ''They''re tracing my hack. Intelligence cyber unit. Cut this line NOW or our position is exposed.''"}',
 '{"encounter_pool":"act2","check_stat":"stealth","check_min":4}',
 NULL, 5, NULL, NULL, 0.4, 1),

-- R8: 제2 배신자
('act2_random_second_spy', 'main_citizen', 2, 'random_encounter',
 '{"ko":"김 보좌관을 잡은 지 30분 후.\n\n또 다른 신호가 감지된다.\n\n\"...잠깐, 이건 다른 주파수예요.\n또 있어!\"\n\n두 번째 스파이는 의원이었다.\n\n박민수 의원.\n\"나는 가족을 지키려 한 것뿐이야...\"\n\n[제2 배신자 발각 — 충격 + 정보+1]","en":"30 minutes after catching aide Kim: another signal. A second spy — Lawmaker Park. ''I was just trying to protect my family...''"}',
 '{"encounter_pool":"act2","encounter_condition":"post_bp5"}',
 NULL, 10, '{"intel":1}', NULL, 0.3, 1),

-- R9: 배신자의 아내 전화
('act2_random_spy_wife', 'main_citizen', 2, 'random_encounter',
 '{"ko":"김 보좌관의 위성전화가 울린다.\n\n장악한 전화기에서 여자 목소리:\n\n\"여보... 살아있어?\n아이가 울고 있어.\n저 사람들이 문 앞에 서 있어...\"\n\n전화가 끊긴다.\n\n한세진의 손이 멈춘다.\n\n이 남자는 배신자다.\n하지만 이 남자의 가족은...\n\n[도덕적 딜레마 — 의지+1 or 정보+1]","en":"The spy''s satellite phone rings. His wife: ''Are you alive? The baby is crying. They''re standing at our door...'' The call cuts. He''s a traitor, but his family..."}',
 '{"encounter_pool":"act2","moral_choice":true}',
 NULL, 5, '{"will":1}', 'humanist', 0.5, 1),

-- R10: 추가 증거 발견
('act2_random_extra_evidence', 'main_citizen', 2, 'random_encounter',
 '{"ko":"벙커 구석에서 오래된 금고를 발견한다.\n\n비밀번호는... 건국 연도.\n\n안에는 1987년의 문서가 있다.\n\n\"39년 전에도 같은 일이 있었다.\n그때의 계엄 명령서와\n오늘의 Directive 6.\n\n구조가 거의 동일하다.\n심지어 조항 번호까지.\"\n\n\"복사해서 쓴 거야...\n39년 전 문서를 그대로.\"\n\n[역사적 전례 증거 — 정보+3]","en":"A old safe in the bunker. Inside: 1987 documents. The martial law decree from 39 years ago — structurally identical to Directive 6. ''They literally copied it.''"}',
 '{"encounter_pool":"act2","atmosphere":"historical"}',
 NULL, 10, '{"intel":3}', NULL, 0.3, 1)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 서브 분기 선택지 연결
-- ──────────────────────────────────────

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Sub-4A: 통신 장비
('main_citizen', 'act2_sub4a', 0,
 '{"ko":"🔧 직접 수리","en":"Repair it yourself"}',
 '{"ko":"시간이 걸리지만 군 통신 도청 가능","en":"Takes time but enables military eavesdropping"}',
 'act2_sub4a_result_a', 30, '{"intel":2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub4a', 1,
 '{"ko":"👨‍🔧 전문가 찾기","en":"Find a specialist"}',
 '{"ko":"더 빠르고 품질도 좋다","en":"Faster and better quality"}',
 'act2_sub4a_result_b', 20, '{"intel":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Sub-5A: 용의자 좁히기
('main_citizen', 'act2_sub5a', 0,
 '{"ko":"📹 CCTV 분석","en":"CCTV analysis"}',
 '{"ko":"영상 증거로 특정","en":"Identify via footage"}',
 'act2_sub5a_result_a', 20, '{"intel":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub5a', 1,
 '{"ko":"🗣 증언 수집","en":"Collect testimonies"}',
 '{"ko":"동료들의 관찰력에 의존","en":"Rely on colleagues'' observations"}',
 'act2_sub5a_result_b', 15, '{"intel":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub5a', 2,
 '{"ko":"📡 통신 기록 대조","en":"Cross-reference signals"}',
 '{"ko":"기술적 분석. 위치까지 좁힌다","en":"Technical analysis pinpoints location"}',
 'act2_sub5a_result_c', 25, '{"intel":2}', '{"intel":{"min":3}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'intel', 3, NULL),

-- Sub-5B: 심문 방식
('main_citizen', 'act2_sub5b', 0,
 '{"ko":"💬 부드러운 대화","en":"Gentle conversation"}',
 '{"ko":"공감으로 진실을 끌어낸다","en":"Draw truth through empathy"}',
 'act2_sub5b_result_a', 15, '{"intel":3}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub5b', 1,
 '{"ko":"⚖️ 직접 추궁","en":"Direct confrontation"}',
 '{"ko":"증거를 제시하고 자백 요구","en":"Present evidence, demand confession"}',
 'act2_sub5b_result_b', 10, '{"intel":2}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub5b', 2,
 '{"ko":"📱 증거 제시","en":"Present physical evidence"}',
 '{"ko":"위성전화 통화 기록으로 압박","en":"Pressure with satellite phone records"}',
 'act2_sub5b_result_c', 10, '{"intel":2}', '{"intel":{"min":4}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'intel', 4, NULL),

-- Sub-5C: 배신자 처리
('main_citizen', 'act2_sub5c', 0,
 '{"ko":"🔒 지하실 감금","en":"Lock in basement"}',
 '{"ko":"안전하고 무난한 처리","en":"Safe, standard handling"}',
 'act2_sub5c_result_a', 5, '{"will":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub5c', 1,
 '{"ko":"🕵️ 이중 스파이로 활용","en":"Turn double agent"}',
 '{"ko":"거짓 정보를 역으로 보낸다","en":"Feed false intel back to military"}',
 'act2_sub5c_result_b', 5, '{"intel":3}', '{"intel":{"min":5}}', 'conspiring', NULL, FALSE, 0, TRUE, 'intel', 5, 'act2_sub5c_result_a'),

('main_citizen', 'act2_sub5c', 2,
 '{"ko":"📢 공개 처벌","en":"Public exposure"}',
 '{"ko":"투명성 확보, 하지만 불안감 증가","en":"Transparency, but anxiety increases"}',
 'act2_sub5c_result_c', 10, '{"will":2}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Sub-6A: 증거 수집 팀
('main_citizen', 'act2_sub6a', 0,
 '{"ko":"👥 정예 팀 구성","en":"Elite team"}',
 '{"ko":"3인 1조, 역할 분담 명확","en":"3-person team, clear roles"}',
 'act2_sub6a_result_a', 10, '{"intel":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act2_sub6a', 1,
 '{"ko":"🦸 단독 행동","en":"Go alone"}',
 '{"ko":"의원 신분으로 관저 진입","en":"Use congressional status to enter The Pinnacle"}',
 'act2_sub6a_result_b', 5, '{"will":2}', '{"will":{"min":6}}', 'righteous', NULL, FALSE, 0, TRUE, 'will', 6, NULL),

('main_citizen', 'act2_sub6a', 2,
 '{"ko":"💻 원격 해킹","en":"Remote hack"}',
 '{"ko":"차영은이 방화벽을 뚫는다","en":"Zero cracks the firewalls"}',
 'act2_sub6a_result_c', 30, '{"intel":2}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ Act 2 확장 시드 완료
-- CP-Mid 1개 + 서브 분기 5개(14결과노드)
-- 미니 이벤트: 8개 (ME11~ME18)
-- 랜덤 조우: 5개 (R6~R10)
-- 선택지: 16개


-- ====== 20260222_seed_act3.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — ACT 3 시나리오 데이터 시드
-- 결전 (04:00~06:00): 3분기점, 8개 엔딩
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- BP8 도입부
('act3_pre_bp8', 'main_citizen', 3, 'story',
 '{"ko":"시간: 02:00:00 남음\n\n장갑차 행렬이 Grand Assembly를 포위했다.\n장태호의 최종 통첩이 울린다.\n\n\"의회 건물 내부의 모든 인원에게 고합니다.\nRed Dawn 작전이 개시됩니다.\n60분 이내에 건물을 비우지 않을 경우,\n강제 진입합니다. 이것은 최종 경고입니다.\"\n\n한세진의 손이 떨린다.","en":"Armored vehicles surround Grand Assembly. General Jang issues a final ultimatum: evacuate in 60 minutes or face forced entry."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 8: Red Dawn 대응
('act3_bp8', 'main_citizen', 3, 'branch_main',
 '{"ko":"군이 진입한다. 60분 후 강제 진입.\n\n장갑차의 엔진 소리가 점점 가까워진다.\n\n어떻게 막겠는가?","en":"The military is coming in. 60 minutes until forced entry. How do you stop them?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP8 결과 노드
('act3_bp8_result_a', 'main_citizen', 3, 'story',
 '{"ko":"\"바리케이드를 치겠습니다!\"\n\n의원들과 시민들이 함께 의자, 책상, 서고를 끌어 문을 막는다.\n\n한세진이 차분하게 말한다.\n\"세 가지 방법이 있습니다. 첫째, 바리케이드. 둘째, 후문 확보. 셋째, 바깥 의원 호송.\n한 시간만 버팁시다. 커피 한 잔 분량입니다.\"\n\n시간이 흐른다. 밖에서 군의 해체 시도가 이어진다.\n하지만 30분이 지나자... 추가 의원 호송 차량이 보인다.\n\n20명이 더 도착했다.\n\n[바리케이드 성공 — 시간 확보 + 의원 추가]","en":"Barricades hold for 30 minutes. Then reinforcements arrive — 20 more lawmakers break through."}',
 '{}', NULL, 30, '{"will":2}', 'righteous'),

('act3_bp8_result_b', 'main_citizen', 3, 'story',
 '{"ko":"사라 첸의 카메라가 켜진다.\n\n\"전세계에 생중계됩니다. 지금 Veridian 의회에 군이 진입하려 하고 있습니다.\"\n\nCNN, BBC, NHK가 동시에 속보를 내보낸다.\n\n장태호의 참모가 속삭인다.\n\"사령관, 전 세계가 보고 있습니다.\"\n\n장태호가 이를 악문다.\n\"...30분 대기.\"\n\n[국제 방송 저지 — 군 30분 추가 대기]","en":"Live broadcast goes global. CNN, BBC, NHK break the news simultaneously. The general orders a 30-minute standdown."}',
 '{}', NULL, 20, '{"public":3}', 'humanist'),

('act3_bp8_result_c', 'main_citizen', 3, 'story',
 '{"ko":"한세진이 직접 정문으로 걸어 나간다.\n\n장태호와 마주선다.\n\n\"사령관, 당신의 아들 이수빈은 지금 이 건물 안에 있소.\"\n\n장태호의 표정이 변한다.\n\n\"...아들이?\"\n\n긴 침묵.\n\n\"3시간. 3시간을 주겠다.\"\n\n[장태호 동요 — 3시간 유예 확보]","en":"You confront the general: \"Your son Lee Subin is inside.\" The general''s composure cracks. \"Three hours.\""}',
 '{}', NULL, 15, '{"network":2}', 'pragmatic'),

('act3_bp8_result_d', 'main_citizen', 3, 'story',
 '{"ko":"Sentinel의 마지막 카드.\n\n모든 화면에 동시에 문서가 뿌려진다.\n이중 서명. 비자금. 해외 계좌.\n\n군 통신망에도 침투한다.\n\"장교 여러분, 이것이 당신들이 지키려는 정권의 실체입니다.\"\n\n장교단의 30%가 명령 불복종을 선언한다.\n\n[군 내부 분열 — Sentinel 최종 단계]","en":"Sentinel dumps everything across all screens. 30% of officers declare disobedience."}',
 '{"requires_sentinel_full":true}', NULL, 10, '{"intel":3,"public":2}', 'conspiring'),

-- BP8 실패 → E5 철의 장막
('act3_bp8_fail', 'main_citizen', 3, 'story',
 '{"ko":"바리케이드가 무너졌다.\n\n군화 소리가 복도를 채운다.\n\n\"모든 의원은 신분증을 제시하시오.\"\n\n한세진이 끌려나간다.\nGrand Assembly의 불이 꺼진다.","en":"The barricades fall. Military boots echo through the corridors. Lawmakers are dragged out one by one."}',
 '{}', NULL, 0, NULL, NULL),

-- BP9 도입부
('act3_pre_bp9', 'main_citizen', 3, 'story',
 '{"ko":"시간: 약 01:00:00 남음\n\nRed Dawn을 일시적으로 저지했다.\n하지만 정족수에는 아직 부족하다.\n\n비서관이 달려온다.\n\"긴급 상황입니다. 세 가지 방법이 남았습니다. 하지만 각각 대가가 있습니다.\"","en":"Red Dawn temporarily halted. But quorum is still short. Three options remain — each with a price."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 9: 최후의 선택
('act3_bp9', 'main_citizen', 3, 'branch_main',
 '{"ko":"정족수에 도달하려면 극단적 선택이 필요하다.\n\n어떤 대가를 치르겠는가?","en":"Reaching quorum requires desperate measures. What price are you willing to pay?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP9 결과 노드
('act3_bp9_result_a', 'main_citizen', 3, 'story',
 '{"ko":"서윤하 재판관에게 연락한다.\n\n\"재판관님, 계엄 위헌 긴급 판결을 내려주십시오.\"\n\n서윤하가 침묵한다.\n\"그러면 제 가족은...?\"\n\"...보호하겠습니다.\"\n\n30분 후, 헌법재판소 긴급 결정문이 떨어진다.\n\n\"Directive 6, 위헌.\"\n\n서윤하의 손이 법전을 꽉 쥔다.\n40년간의 부적.\n\n[위헌 판결 — 계엄 무효화 가능]","en":"Judge Seo Yunha issues an emergency ruling: Directive 6 is unconstitutional. Her hand grips the law book — her talisman of 40 years. But her family is now in danger."}',
 '{}', NULL, 30, '{"intel":2}', 'pragmatic'),

('act3_bp9_result_b', 'main_citizen', 3, 'story',
 '{"ko":"윤다혜가 Liberty Square에서 함성을 지른다.\n\n\"시민 여러분! Grand Assembly까지 행진합시다!\"\n\n수만 명의 시민이 거리를 메운다.\n촛불이 Centris의 밤을 밝힌다.\n\n군 병력이 시민 행렬 앞에서 멈춘다.\n\"쏠 수 없습니다. 쏘면 끝입니다.\"\n\n[시민 봉기 — 하지만 충돌 위험]","en":"Tens of thousands march from Liberty Square. Candles light the night. Soldiers hesitate to fire."}',
 '{}', NULL, 25, '{"public":4,"will":2}', 'humanist'),

('act3_bp9_result_c', 'main_citizen', 3, 'story',
 '{"ko":"백준서 총리가 접근한다.\n\n\"군부 측 의원 중 매수 가능한 사람이 있소.\n돈과 이후 보복 면제. 이 두 가지면 됩니다.\"\n\n한세진이 고민한다.\n\"...이것이 우리가 지키려는 민주주의인가?\"\n\n백준서가 고개를 젓는다.\n\"지금은 수단을 가릴 때가 아닙니다.\"\n\n그의 눈이 의미심장하게 빛난다.\n40년간 살아남은 정치인의 본능.\n이 혼란 속에서 자신의 무대를 만들고 있는 것 같다.\n\n정족수가 채워진다. 하지만 마음이 무겁다.\n\n[정족수 달성 — 하지만 더러운 거래]","en":"PM Baek approaches with a deal. His eyes gleam — 40 years of survival calculating behind composure. Quorum reached, but the stain remains."}',
 '{}', NULL, 20, '{"network":3}', 'cold_blood'),

('act3_bp9_result_d', 'main_citizen', 3, 'story',
 '{"ko":"이수빈을 포함한 젊은 장교 12명이 앞으로 나선다.\n\n\"우리는 국민의 군대입니다. 국민을 향해 총을 들 수 없습니다.\"\n\n군복을 벗는다.\n\n장태호의 눈이 흔들린다.\n자신의 아들이 명령 불복종을 선언했다.\n\n군 자체가 분열한다.\n\n[군 내부 반란 — 결정적 전환점]","en":"12 young officers, including Lee Subin, refuse orders. \"We are the people''s army.\" The military fractures from within."}',
 '{}', NULL, 15, '{"will":3,"network":2}', 'righteous'),

-- BP10: 카운트다운 종료
('act3_bp10', 'main_citizen', 3, 'story',
 '{"ko":"시간: 00:30:00 남음\n\n모든 카드를 쓴 뒤.\n\n마지막 30분.\n의회 본회의장에 남은 사람들이 모여 앉는다.\n\n한세진이 단상에 오른다.\n의원들, 시민들, 기자들이 지켜본다.\n\n\"여러분.\"\n\n6시간 전, 혼자 새벽 거리를 달렸던 사람이\n지금 동지들과 함께 서 있다.\n\n\"투표합시다.\"\n\n━━━ 최종 표결 ━━━","en":"00:30:00 remaining. All cards played. Han Sejin takes the podium. \"Let us vote.\""}',
 '{}', NULL, 30, NULL, NULL),

-- ═════════════ 8개 엔딩 ═════════════

-- E1: 완벽한 민주주의 (True Good)
('ending_e1', 'main_citizen', 3, 'ending',
 '{"ko":"표결: 찬성 158, 반대 31.\n\n의장의 의사봉이 울린다.\n\n\"Directive 6, 계엄 선포는 무효입니다.\"\n\nGrand Assembly 밖에서 환호성이 터져 나온다.\nLiberty Square에 모인 수만 명의 시민이 서로를 껴안는다.\n\n장태호 사령관이 무전기를 내려놓는다.\n\"...전 부대 철수.\"\n\n해가 뜬다.\nCentris의 새벽.\n\n한세진이 의회 입구에 서서 떠오르는 태양을 본다.\n\n\"6시간이었다.\n겨우 6시간.\n하지만 이 6시간으로\n역사가 달라졌다.\"\n\n— The Republic stands. —\n\n⋯ 2주 후. 법정.\n강무현 정보국장이 증언한다.\n\"...저 위에 한 분이 더 계십니다.\n하지만 그분은... 증거가 없습니다.\"\n\n아직 체포되지 않은 이름 하나.","en":"Vote: 158 for, 31 against. Directive 6 is void. The sun rises on a free Centris. Six hours changed history. Two weeks later, Kang Muhyun testifies: There is one above me. But no evidence. One name uncaptured."}',
 '{"title":{"ko":"완벽한 민주주의","en":"Perfect Democracy"},"grade":"true_good","reward_credits":500,"achievement":"veridian_guardian","unlock_title":"legendary"}',
 '{"quorum_met":true,"evidence_secured":true,"military_blocked":true}', 0, NULL, NULL),

-- E2: 타협의 새벽 (Good)
('ending_e2', 'main_citizen', 3, 'ending',
 '{"ko":"표결: 찬성 153, 반대 42.\n\n계엄은 해제되었다. 하지만 대가가 있었다.\n\n군부에 대한 면책 조항이 추가되었고,\n일부 권한이 대통령에게 양보되었다.\n\n한세진이 중얼거린다.\n\"이긴 건가? 진 건가?\"\n\n기자 사라 첸이 묻는다.\n\"한 지도자님, 이것이 승리입니까?\"\n\n\"...다음을 위한 첫 걸음이라고 합시다.\"\n\n— A fragile dawn. —","en":"Vote: 153-42. Martial law lifted, but with immunities for the military and concessions to the president. A fragile victory."}',
 '{"title":{"ko":"타협의 새벽","en":"A Fragile Dawn"},"grade":"good","reward_credits":300,"unlock_title":"rare"}',
 '{"quorum_met":true,"compromised":true}', 0, NULL, NULL),

-- E3: 피로스의 승리 (Neutral)
('ending_e3', 'main_citizen', 3, 'ending',
 '{"ko":"표결은 통과되었다.\n그러나 Liberty Square에서 군경과 시민이 충돌했다.\n\n부상자 37명. 중상 8명.\n\n한세진이 병원으로 달려간다.\n윤다혜가 들것에 실려 나온다.\n\n\"...우리가 이겼나요, 지도자님?\"\n\n한세진은 대답하지 못한다.\n\nTV 뉴스: \"계엄은 해제되었으나,\n이 밤의 상처는 오래 남을 것입니다.\"\n\n— Victory at what cost? —","en":"The vote passes, but citizens and soldiers clashed. 37 injured. Yoon Dahye is carried out on a stretcher."}',
 '{"title":{"ko":"피로스의 승리","en":"Pyrrhic Victory"},"grade":"neutral","reward_credits":250,"unlock_title":"special"}',
 '{"quorum_met":true,"civilian_clash":true}', 0, NULL, NULL),

-- E4: 긴 밤 (Neutral-Bad)
('ending_e4', 'main_citizen', 3, 'ending',
 '{"ko":"시간이 다 됐다.\n\n계엄군이 Centris에 입성한다.\n그러나 한세진은 체포되지 않았다.\n\n\"오늘 밤은 실패했다.\n하지만 우리는 47명에서 시작해 이만큼 모았다.\"\n\n비서관이 묻는다.\n\"다음은 어떻게 합니까?\"\n\n\"...다음 6시간을 준비하자.\"\n\n— The night continues. —","en":"Time runs out. The military takes Centris, but you escape. \"Prepare for the next six hours.\""}',
 '{"title":{"ko":"긴 밤","en":"The Long Night"},"grade":"neutral_bad","reward_credits":150,"rogue_unlock":"lawmaker_contacts"}',
 '{"quorum_met":false,"time_expired":true,"captured":false}', 0, NULL, NULL),

-- E5: 철의 장막 (Bad)
('ending_e5', 'main_citizen', 3, 'ending',
 '{"ko":"군화 소리가 복도를 채운다.\n\n\"모든 의원은 신분증을 제시하시오.\"\n\n한세진이 끌려나간다.\nGrand Assembly의 불이 꺼진다.\n\n다음 날 아침, VBS 뉴스:\n\"정부는 반역적 의회 활동을 성공적으로 차단했다고 발표했습니다...\"\n\n— Darkness falls. —","en":"Military boots fill the corridors. Lawmakers are detained. The Assembly goes dark. State media declares victory."}',
 '{"title":{"ko":"철의 장막","en":"Iron Curtain"},"grade":"bad","reward_credits":100,"rogue_unlock":"military_patterns"}',
 '{"red_dawn_failed":true}', 0, NULL, NULL),

-- E6: 망명 (Bad)
('ending_e6', 'main_citizen', 3, 'ending',
 '{"ko":"한세진이 외국 대사관 차량에 오른다.\n\n뒷좌석에서 Centris의 불빛이 멀어지는 것을 본다.\n\n\"비겁한 건가?\"\n\n라디오에서 윤다혜의 목소리가 들린다.\n\"지도자님은... 오지 않습니다.\n하지만 우리는 여기 있습니다.\"\n\n— You survived. But at what cost? —","en":"You flee to a foreign embassy. Through the radio, you hear those you left behind carrying on without you."}',
 '{"title":{"ko":"망명","en":"Exile"},"grade":"bad","reward_credits":50}',
 '{"chose_exile":true}', 0, NULL, NULL),

-- E7: 순교자 (Bad-Noble)
('ending_e7', 'main_citizen', 3, 'ending',
 '{"ko":"군이 진입한다.\n한세진은 자리에서 일어나지 않는다.\n\n\"이 자리는 국민이 준 자리입니다.\n군화로 밟을 수 있는 자리가 아닙니다.\"\n\n카메라가 돌아가고 있다.\n사라 첸이 마지막까지 촬영한다.\n\n한세진이 끌려나가는 영상이 전 세계로 퍼진다.\n\n1주일 후, 국제사회의 제재가 시작된다.\n1개월 후, 더 큰 시민 혁명이 일어난다.\n\n한세진은 감옥에서 이 소식을 전해 듣는다.\n\"...6시간이 아니었다.\n첫 6시간이었을 뿐이다.\"\n\n— A seed planted in defiance. —","en":"You refuse to leave your seat. The footage goes global. Sanctions follow. A greater revolution rises. From prison, you hear the news."}',
 '{"title":{"ko":"순교자","en":"The Martyr"},"grade":"bad_noble","reward_credits":350,"achievement":"undying_torch","unlock_title":"legendary"}',
 '{"quorum_met":false,"stayed_to_end":true,"will_high":true}', 0, NULL, NULL),

-- E8: Sentinel (Hidden)
('ending_e8', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ HIDDEN ENDING: SENTINEL ━━━\n\n모든 진실이 밝혀진다.\n\n화면에 문서들이 쏟아진다.\n이중 서명. 비자금 경로. 해외 계좌.\n쿠데타의 진짜 배후.\n\n대통령은 꼭두각시였다.\n장태호도 이용당한 것이었다.\n진짜 적은... 훨씬 높은 곳에 있었다.\n\n강무현이 마지막으로 말한다.\n\"이제... 나도 자유인가?\"\n\n증거 앞에 모든 것이 무너진다.\n계엄군이 스스로 철수한다.\n군복을 벗는 장교들.\n의회에 불이 다시 켜진다.\n\n한세진이 강무현을 바라본다.\n\"당신은 영웅인가, 악당인가?\"\n\n강무현이 웃는다.\n\"그건... 다음 6시간에 밝혀지겠죠.\"\n\n[TO BE CONTINUED...]\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"SENTINEL. All truths revealed. The president was a puppet. The real enemy stands far higher. Kang smiles: \"That''s for the next six hours.\""}',
 '{"title":{"ko":"Sentinel","en":"Sentinel"},"grade":"hidden","reward_credits":1000,"achievement":"price_of_truth","unlock_title":"legendary","unlock_avatar":"sentinel","teaser":"season2"}',
 '{"sentinel_complete":true}', 0, NULL, NULL),

-- 도주 선택 노드
('act3_exile_choice', 'main_citizen', 3, 'story',
 '{"ko":"외국 대사관에서 연락이 온다.\n\n\"차량을 보냈습니다. 지하 주차장에 대기 중입니다.\n지금 떠나면 안전을 보장합니다.\"\n\n떠날 것인가, 남을 것인가?","en":"The embassy has a car waiting. Leave now and safety is guaranteed. Stay and face whatever comes."}',
 '{}', NULL, 5, NULL, NULL),

-- 최후 저항 노드
('act3_last_stand', 'main_citizen', 3, 'story',
 '{"ko":"시간이 0이 되었다.\n\n군이 진입한다.\n\n한세진은 의장석에 앉아 있다.\n\n\"나는 이 자리에서 움직이지 않겠습니다.\"","en":"Time is up. The military enters. You sit in the Speaker''s chair. \"I will not move from this seat.\""}',
 '{}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── ACT 3 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Choke3 → BP8 도입부
('main_citizen', 'act2_choke3', 0, '{"ko":"Act 3로 진행","en":"Proceed to Act 3"}', '{"ko":"","en":""}', 'act3_pre_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도입부 → BP8
('main_citizen', 'act3_pre_bp8', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act3_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 8: Red Dawn 대응
('main_citizen', 'act3_bp8', 0,
 '{"ko":"🛡️ 바리케이드를 치고 농성","en":"Barricade and hold the line"}',
 '{"ko":"한 시간을 버텨라. 한 시간이면 된다","en":"Hold for one hour. Just one hour."}',
 'act3_bp8_result_a', 30, '{"will":2}', '{"will":{"min":8}}', 'righteous', NULL, FALSE, 0, TRUE, 'will', 8, 'act3_bp8_fail'),

('main_citizen', 'act3_bp8', 1,
 '{"ko":"📡 국제 생방송으로 저지","en":"Stop them with international broadcast"}',
 '{"ko":"전 세계가 보고 있다. 쏘지 못한다","en":"The world is watching. They can''t shoot."}',
 'act3_bp8_result_b', 20, '{"public":3}', '{"public":{"min":8}}', 'humanist', '{"sarah_chen":2}', FALSE, 0, TRUE, 'public', 8, 'act3_bp8_fail'),

('main_citizen', 'act3_bp8', 2,
 '{"ko":"🤝 장태호와 직접 협상","en":"Negotiate directly with General Jang"}',
 '{"ko":"당신의 아들이 이 안에 있소","en":"Your son is inside this building."}',
 'act3_bp8_result_c', 15, '{"network":2}', '{"intel":{"min":7}}', 'pragmatic', '{"jang_taeho":3}', FALSE, 0, TRUE, 'intel', 7, 'act3_bp8_fail'),

('main_citizen', 'act3_bp8', 3,
 '{"ko":"🔓 Sentinel의 최종 카드","en":"Play Sentinel''s final card"}',
 '{"ko":"모든 것을 공개한다","en":"Expose everything."}',
 'act3_bp8_result_d', 10, '{"intel":3,"public":2}', NULL, 'conspiring', '{"kang_muhyun":3}', TRUE, 150, FALSE, NULL, NULL, NULL),

-- BP8 실패 → E5
('main_citizen', 'act3_bp8_fail', 0, '{"ko":"...","en":"..."}', '{"ko":"","en":""}', 'ending_e5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP8 결과 → BP9 연결
('main_citizen', 'act3_bp8_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act3_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp8_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act3_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp8_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act3_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp8_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'act3_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도입부 → BP9
('main_citizen', 'act3_pre_bp9', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'act3_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 9: 최후의 선택
('main_citizen', 'act3_bp9', 0,
 '{"ko":"⚖️ 위헌 판결로 우회","en":"Bypass with unconstitutionality ruling"}',
 '{"ko":"서윤하 재판관의 긴급 판결","en":"Judge Seo''s emergency ruling"}',
 'act3_bp9_result_a', 30, '{"intel":2}', NULL, 'pragmatic', '{"seo_yunha":2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_bp9', 1,
 '{"ko":"🏴 시민 봉기 촉발","en":"Spark a citizen uprising"}',
 '{"ko":"Liberty Square에서 행진","en":"March from Liberty Square"}',
 'act3_bp9_result_b', 25, '{"public":4,"will":2}', '{"public":{"min":9}}', 'humanist', '{"yoon_dahye":3}', FALSE, 0, TRUE, 'public', 9, 'act3_exile_choice'),

('main_citizen', 'act3_bp9', 2,
 '{"ko":"🔄 이적 의원 매수","en":"Bribe defecting lawmakers"}',
 '{"ko":"돈과 면제. 이 두 가지면 된다","en":"Money and immunity. That''s all it takes."}',
 'act3_bp9_result_c', 20, '{"network":3}', '{"network":{"min":8}}', 'cold_blood', '{"baek_junseo":2}', FALSE, 0, TRUE, 'network', 8, 'act3_exile_choice'),

('main_citizen', 'act3_bp9', 3,
 '{"ko":"🎺 군 내부 반란 유도","en":"Incite military mutiny"}',
 '{"ko":"젊은 장교들이 일어설 것이다","en":"The young officers will rise."}',
 'act3_bp9_result_d', 15, '{"will":3,"network":2}', NULL, 'righteous', '{"lee_subin":3}', TRUE, 200, FALSE, NULL, NULL, NULL),

-- BP9 결과 → BP10
('main_citizen', 'act3_bp9_result_a', 0, '{"ko":"최종 표결로","en":"To the final vote"}', '{"ko":"","en":""}', 'act3_bp10', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp9_result_b', 0, '{"ko":"최종 표결로","en":"To the final vote"}', '{"ko":"","en":""}', 'act3_bp10', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp9_result_c', 0, '{"ko":"최종 표결로","en":"To the final vote"}', '{"ko":"","en":""}', 'act3_bp10', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('main_citizen', 'act3_bp9_result_d', 0, '{"ko":"최종 표결로","en":"To the final vote"}', '{"ko":"","en":""}', 'act3_bp10', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 도주 선택지
('main_citizen', 'act3_exile_choice', 0,
 '{"ko":"🚗 대사관 차량에 탑승 — 망명","en":"Get in the embassy car — exile"}',
 '{"ko":"살아남아야 싸울 수 있다","en":"You have to survive to fight another day"}',
 'ending_e6', 0, NULL, NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_exile_choice', 1,
 '{"ko":"🔥 여기 남겠다","en":"I''m staying here"}',
 '{"ko":"도주는 패배다","en":"To flee is to lose"}',
 'act3_last_stand', 0, '{"will":2}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 최후 저항 → 순교자 엔딩
('main_citizen', 'act3_last_stand', 0, '{"ko":"...","en":"..."}', '{"ko":"","en":""}', 'ending_e7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP10 → 엔딩 분기 (게임 엔진이 조건에 따라 자동 라우팅)
-- 기본 목적지는 E2 (Good), 게임 엔진이 스탯과 조건으로 최종 엔딩 결정
('main_citizen', 'act3_bp10', 0,
 '{"ko":"투표 시작","en":"Begin the vote"}',
 '{"ko":"최종 표결을 시작한다","en":"Initiate the final vote"}',
 'ending_e2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ── 엔딩 메타데이터 등록 ──

INSERT INTO endings (id, scenario_id, title, description, grade, conditions, rewards) VALUES
('ending_e1', 'main_citizen',
 '{"ko":"완벽한 민주주의","en":"Perfect Democracy"}',
 '{"ko":"정족수 달성. 군 저지. 증거 확보. 역사가 달라졌다.","en":"Quorum met. Military blocked. Evidence secured. History changed."}',
 'true_good',
 '{"quorum_met":true,"evidence_secured":true,"military_blocked":true}',
 '{"credits":500,"achievement":"veridian_guardian","title":"legendary"}'),

('ending_e2', 'main_citizen',
 '{"ko":"타협의 새벽","en":"A Fragile Dawn"}',
 '{"ko":"계엄은 해제. 하지만 대가가 있었다.","en":"Martial law lifted. But at a cost."}',
 'good',
 '{"quorum_met":true,"compromised":true}',
 '{"credits":300,"title":"rare"}'),

('ending_e3', 'main_citizen',
 '{"ko":"피로스의 승리","en":"Pyrrhic Victory"}',
 '{"ko":"승리했다. 그러나 시민이 피를 흘렸다.","en":"Victory. But citizens bled."}',
 'neutral',
 '{"quorum_met":true,"civilian_clash":true}',
 '{"credits":250,"title":"special"}'),

('ending_e4', 'main_citizen',
 '{"ko":"긴 밤","en":"The Long Night"}',
 '{"ko":"정족수 미달. 하지만 포기하지 않는다.","en":"Quorum failed. But we don''t give up."}',
 'neutral_bad',
 '{"quorum_met":false,"time_expired":true}',
 '{"credits":150,"rogue_unlock":"lawmaker_contacts"}'),

('ending_e5', 'main_citizen',
 '{"ko":"철의 장막","en":"Iron Curtain"}',
 '{"ko":"군이 진입했다. 의회는 끝났다.","en":"The military entered. The Assembly is over."}',
 'bad',
 '{"red_dawn_failed":true}',
 '{"credits":100,"rogue_unlock":"military_patterns"}'),

('ending_e6', 'main_citizen',
 '{"ko":"망명","en":"Exile"}',
 '{"ko":"살아남았다. 하지만 모든 것을 잃었다.","en":"You survived. But lost everything."}',
 'bad',
 '{"chose_exile":true}',
 '{"credits":50}'),

('ending_e7', 'main_citizen',
 '{"ko":"순교자","en":"The Martyr"}',
 '{"ko":"끝까지 저항했다. 씨앗이 남았다.","en":"You resisted to the end. A seed was planted."}',
 'bad_noble',
 '{"stayed_to_end":true,"will_high":true}',
 '{"credits":350,"achievement":"undying_torch","title":"legendary"}'),

('ending_e8', 'main_citizen',
 '{"ko":"Sentinel","en":"Sentinel"}',
 '{"ko":"모든 진실이 밝혀졌다. 하지만 이야기는 끝나지 않았다.","en":"All truths revealed. But the story isn''t over."}',
 'hidden',
 '{"sentinel_complete":true}',
 '{"credits":1000,"achievement":"price_of_truth","title":"legendary","avatar":"sentinel","teaser":"season2"}')

ON CONFLICT DO NOTHING;

-- ✅ ACT 3 + 8 엔딩 시나리오 시드 완료


-- ====== 20260222_seed_act3_expanded.sql ======
-- ═══════════════════════════════════════════════════
-- 6 Hours v2 — ACT 3 확장 시드
-- 서브 분기 + CP-Final + 미니 이벤트 + 랜덤 조우 + 16 추가 엔딩
-- ═══════════════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ── CP-Final: 05:00 최후의 관문 ──
('act3_cp_final', 'main_citizen', 3, 'choke',
 '{"ko":"━━━ 05:00 — 최후의 관문 ━━━\n\n1시간 남았다.\n\n현재 정족수: [현재] / 151\nRed Dawn 예상 시간: 05:30~06:00\n\n한세진이 모인 사람들을 바라본다.\n\n\"마지막 1시간입니다.\n모든 것이 이 1시간에 달려 있습니다.\"\n\n외부에서 장갑차 전진 소리가 들린다.\n\n━━━ 최종 결전 ━━━","en":"━━━ 05:00 — The Final Gate ━━━\n1 hour remains. APCs advance outside. ''Everything depends on this last hour.''"}',
 '{"choke_type":"final_checkpoint"}', NULL, 5, NULL, NULL),

-- ── Sub-8A: 최후통첩 대응 ──
('act3_sub8a', 'main_citizen', 3, 'branch_sub',
 '{"ko":"장태호의 최후통첩 전화:\n\"한 지도자, 05:30까지 해산하시오.\n그렇지 않으면 진입합니다.\"\n\n어떻게 대응할 것인가?","en":"Jang''s ultimatum: ''Disperse by 05:30 or we enter.'' How do you respond?"}',
 '{}', NULL, 5, NULL, NULL),

('act3_sub8a_result_a', 'main_citizen', 3, 'story',
 '{"ko":"\"사령관, 헌법 제77조를 읽어보셨습니까?\n의회가 해제를 요구하면 따라야 합니다.\n\n지금 하시는 일은 반란입니다.\n역사가 기록할 것입니다.\"\n\n전화 너머로 장태호의 긴 침묵.\n\n\"...30분 더 드리겠소.\"\n\n[법적 반박 — 시간 30분 추가 확보]","en":"You cite the Constitution. Long silence. ''...30 more minutes.'' Legal pushback gains time."}',
 '{}', NULL, 5, '{"intel":1}', 'righteous'),

('act3_sub8a_result_b', 'main_citizen', 3, 'story',
 '{"ko":"\"장 사령관.\n당신 아들 이수빈이 지금 광장에 있습니다.\n\n그리고 대통령의 딸 이하은도.\n\n진입하면 당신 아들이 다칠 수도 있습니다.\"\n\n장태호의 호흡이 거칠어진다.\n\n\"...그건 비열한 수법이오!\"\n\n\"비열한 건 민간인에게 총을 겨누는 것입니다.\"\n\n[감정 공격 — 의지+2, Red Dawn 지연]","en":"''Your son is in the square. So is the president''s daughter. If you go in...'' His breathing gets heavy. Emotional leverage."}',
 '{}', NULL, 5, '{"will":2}', 'conspiring'),

('act3_sub8a_result_c', 'main_citizen', 3, 'story',
 '{"ko":"\"들어오십시오.\n우리는 여기 있겠습니다.\n\n하지만 말해두겠습니다.\n CNN이 생중계 중이고,\n전 세계가 보고 있습니다.\n\n당신이 의회에 군을 보내는 장면을\n역사책에서 어떤 페이지에 넣을 건지\n잘 생각해보십시오.\"\n\n전화가 끊긴다.\n\n[정면 도발 — 여론+3, 하지만 진입 임박]","en":"''Come in. We''re here. But CNN is live. Think about what page of history this will be.'' The call ends."}',
 '{}', NULL, 5, '{"public":3}', 'radical'),

-- ── Sub-9A: 표결 직전 마지막 설득 ──
('act3_sub9a', 'main_citizen', 3, 'branch_sub',
 '{"ko":"정족수 151명까지 아직 모자란다.\n마지막으로 한 사람을 더 설득해야 한다.\n\n전화기를 든다. 누구에게 전화할 것인가?","en":"Still short of quorum 151. One more person to convince. Who do you call?"}',
 '{}', NULL, 5, NULL, NULL),

('act3_sub9a_result_a', 'main_citizen', 3, 'story',
 '{"ko":"여당 내 온건파 리더. 정해민 의원.\n\n\"정 의원.\n당신은 대통령의 사람이 아니라\n국민의 대표입니다.\n\n역사의 올바른 편에 서십시오.\"\n\n\"...한 지도자. 내가 가면\n내 가족은 어떻게 되는 겁니까?\"\n\n\"내가 보장하겠습니다.\n국제 앰네스티에 연락했습니다.\"\n\n길고 긴 침묵.\n\n\"...갈 준비를 하겠습니다.\"","en":"You call the moderate ruling party leader. ''Be on the right side of history.'' ''What about my family?'' ''Amnesty International knows your name now.'' Long pause. ''...I''ll come.''"}',
 '{}', NULL, 15, '{"network":2}', 'humanist'),

('act3_sub9a_result_b', 'main_citizen', 3, 'story',
 '{"ko":"중립파 의원들에게 단체 문자:\n\n\"<< 긴급 >>\n지금 오시면 역사의 증인이 됩니다.\n안 오시면 역사의 방관자가 됩니다.\n\n선택은 자유입니다.\n하지만 결과는 영원합니다.\n\n— 한세진\"\n\n3분 후 회신이 온다.\n\"지금 출발합니다\" — 7명","en":"Mass text to neutrals: ''Come now and be a witness to history. Stay home and be a bystander. Your choice is free. The consequences are forever.'' 7 reply: ''On our way.''"}',
 '{}', NULL, 10, '{"public":2,"network":1}', 'righteous'),

-- ── Sub-10A: Sentinel 최종 선택 ──
('act3_sub10a', 'main_citizen', 3, 'branch_sub',
 '{"ko":"Sentinel의 마지막 메시지:\n\n\"모든 증거가 업로드됐습니다.\n공개 버튼을 누르면\n전 세계 언론에 동시 전송됩니다.\n\n하지만... 한 가지 경고합니다.\n이 증거 중에는 당신 동료의 비리도 있습니다.\n야당 3명의 뒷거래 기록이요.\n\n전체 공개하시겠습니까?\n아니면 선별 공개?\"\n\nSentinel의 정체가 궁금하다.\n하지만 지금은...","en":"Sentinel: ''All evidence uploaded. Press Release sends to all global media. Warning: this includes corruption records of 3 of your own allies. Full release or selective?''"}',
 '{}', NULL, 5, NULL, NULL),

('act3_sub10a_result_a', 'main_citizen', 3, 'story',
 '{"ko":"\"전체 공개.\"\n\n\"...동료들의 비리도요?\"\n\n\"우리가 정의를 말하면서\n우리 편의 더러운 것만 감출 순 없습니다.\n\n전부 공개하십시오.\"\n\nSentinel: \"...이해했습니다.\n당신은 진짜군요.\"\n\n[전체 공개 — 정의+3, 하지만 동맹 균열 가능]","en":"''Full release. We can''t claim justice and hide our own dirt.'' Sentinel: ''...You''re the real deal.''"}',
 '{}', NULL, 5, '{"will":3}', 'righteous'),

('act3_sub10a_result_b', 'main_citizen', 3, 'story',
 '{"ko":"\"선별 공개.\n지금은 독재에 맞서야 할 때입니다.\n내부 정리는 승리한 후에.\"\n\nSentinel: \"...실용적이군요.\n하지만 기억하세요.\n숨긴 것은 나중에 더 큰 대가를 치릅니다.\"\n\n[선별 공개 — 동맹 유지, 하지만 숨긴 빚]","en":"''Selective. We fight dictatorship now. Internal cleanup after we win.'' Sentinel: ''Practical. But remember — hidden things demand a larger price later.''"}',
 '{}', NULL, 5, '{"network":2}', 'pragmatic')

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 미니 이벤트
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

('act3_mini_dawn_sky', 'main_citizen', 3, 'mini_event',
 '{"ko":"창밖.\n\n하늘이 변하고 있다.\n검은 밤에 보라색이 스며든다.\n\n새벽이 오고 있다.\n\n한세진이 잠시 창 앞에 선다.\n이 하늘이... 누구의 하늘이 될 것인가.\n\n민주주의의 새벽인가.\n독재의 새벽인가.\n\n1시간 안에 결정된다.","en":"The sky shifts from black to purple. Dawn approaches. Whose dawn will it be? Democracy''s or dictatorship''s? One hour decides."}',
 '{"atmosphere":"dawn_coming"}', NULL, 2, NULL, NULL),

('act3_mini_haeun_broadcast', 'main_citizen', 3, 'mini_event',
 '{"ko":"모니터에 속보가 뜬다.\n\n대통령의 딸 이하은이\n광장에서 마이크를 잡았다.\n\n\"아버지... 저는 무섭습니다.\n하지만 여기 사람들은 더 무서울 겁니다.\n저는 대통령의 딸이기 전에,\n이 나라의 시민입니다.\"\n\n광장의 환호성이 모니터 너머로 들린다.\n\n의원들이 서로를 바라본다.\n\"대통령의 딸까지...\"\n\n[분위기 반전 — 희망]","en":"Breaking: The president''s daughter takes the microphone at the square. ''Father, you are wrong. I am a citizen before I am your daughter.'' Cheers erupt."}',
 '{"atmosphere":"turning_point"}', NULL, 2, NULL, NULL),

('act3_mini_military_cracks', 'main_citizen', 3, 'mini_event',
 '{"ko":"군 무전 도청:\n\n\"사령관, 3개 중대에서 명령 거부 발생.\"\n\"뭐라고?\"\n\"대령 1명이 부대를 철수시켰습니다.\n''시민에게 총을 쏠 수 없다''고...\"\n\n군이 갈라지고 있다.\n\n이것이 시간을 벌어줄 수 있다.\n아니면... 더 위험해질 수 있다.\n추가된 군인은 무장해제 상태인가?","en":"Intercepted: ''3 companies refusing orders. One colonel withdrew his unit: I won''t shoot citizens.'' The military is cracking."}',
 '{"atmosphere":"military_fracture"}', NULL, 2, NULL, NULL),

('act3_mini_family_text', 'main_citizen', 3, 'mini_event',
 '{"ko":"오전 5시 10분.\n\n아내에게서 문자:\n\n\"여보, 뉴스 보고 있어.\n아이가 일어났어.\n''아빠 어디?'' 하길래\n''아빠가 나라를 지키고 있어'' 했어.\n\n살아서 돌아와. 제발.\"\n\n한세진의 눈에 눈물이 고인다.\n\n문자를 보낸다:\n\"돌아갈게. 반드시.\"","en":"5:10 AM. Wife''s text: ''The kid asked where daddy is. I said you''re protecting our country. Please come home alive.'' Tears. ''I will. I promise.''"}',
 '{"atmosphere":"personal"}', NULL, 2, NULL, NULL),

('act3_mini_vote_preparation', 'main_citizen', 3, 'mini_event',
 '{"ko":"표결 준비.\n\n비서관이 투표 용지를 나눠준다.\n흰 종이에 두 칸:\n\n□ 계엄 해제 찬성\n□ 계엄 해제 반대\n\n너무 단순하다.\n이 작은 종이 위의 체크 하나가\n이 나라의 운명을 결정한다.\n\n펜을 잡는 손이 떨리는 의원이 보인다.","en":"Ballot papers distributed. Two boxes: For / Against martial law repeal. Such a simple piece of paper to decide a nation''s fate. Trembling hands grip pens."}',
 '{"atmosphere":"climax_preparation"}', NULL, 2, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 랜덤 조우
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag, encounter_weight, encounter_max) VALUES

('act3_random_deserter_group', 'main_citizen', 3, 'random_encounter',
 '{"ko":"탈영 병사 12명이 의회 정문에 나타난다.\n전원 무장해제 상태.\n\n\"우리는 쏘지 않겠습니다.\n대신 여기를 지키겠습니다.\"\n\n문제는... 이 사람들을 받아들이면\n군 측에서 ''무장 반란''으로 선전할 수 있다.\n\n[수용 or 거부 — 도덕적 딜레마]","en":"12 deserters at the entrance, disarmed. ''We won''t shoot. Let us guard this building.'' But accepting them risks ''armed rebellion'' propaganda."}',
 '{"encounter_pool":"act3","moral_choice":true}',
 NULL, 5, NULL, NULL, 0.4, 1),

('act3_random_last_call', 'main_citizen', 3, 'random_encounter',
 '{"ko":"알 수 없는 번호에서 전화.\n\n\"한 지도자... 저 강무현입니다.\"\n\n정보부장 강무현.\n\n\"...지도자님이 이기실 겁니다.\n저도 압니다.\n\n마지막 부탁입니다.\n제 가족만... 안전하게 해주십시오.\"\n\n적장의 항복?\n아니면 마지막 함정?\n\n[정보+2 or 함정 위험]","en":"Unknown call: Intelligence Director Kang. ''You''re going to win. I know it. My last request — keep my family safe.'' Surrender or trap?"}',
 '{"encounter_pool":"act3"}',
 NULL, 5, '{"intel":2}', NULL, 0.3, 1),

('act3_random_power_cut', 'main_citizen', 3, 'random_encounter',
 '{"ko":"전원이 완전히 차단된다.\n비상 발전기마저 꺼진다.\n\n칠흑 같은 어둠.\n\n하지만 10초 후,\n의원들이 하나둘 스마트폰 손전등을 켠다.\n\n빛이 번진다.\n\n\"...이래도 괜찮겠군.\"","en":"Total power cut. Even backup generators die. 10 seconds of darkness. Then, one by one, lawmakers turn on their phone flashlights. Light spreads. ''This works too.''"}',
 '{"encounter_pool":"act3","atmosphere":"symbolic"}',
 NULL, 3, '{"will":1}', 'humanist', 0.5, 1)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 서브 분기 선택지
-- ──────────────────────────────────────

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

('main_citizen', 'act3_sub8a', 0,
 '{"ko":"📜 법적 반박","en":"Legal rebuttal"}',
 '{"ko":"헌법 제77조로 맞서 시간 확보","en":"Cite Article 77 to buy time"}',
 'act3_sub8a_result_a', 5, '{"intel":1}', '{"intel":{"min":5}}', 'righteous', NULL, FALSE, 0, TRUE, 'intel', 5, NULL),

('main_citizen', 'act3_sub8a', 1,
 '{"ko":"💔 감정 공격 — 아들의 안전","en":"Emotional leverage — his son"}',
 '{"ko":"사령관의 약점을 찌른다","en":"Hit the general''s weak spot"}',
 'act3_sub8a_result_b', 5, '{"will":2}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_sub8a', 2,
 '{"ko":"🔥 정면 도발","en":"Direct provocation"}',
 '{"ko":"세계가 보고 있다고 경고","en":"Warn the world is watching"}',
 'act3_sub8a_result_c', 5, '{"public":3}', NULL, 'radical', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_sub9a', 0,
 '{"ko":"📞 온건파 리더 설득","en":"Convince moderate leader"}',
 '{"ko":"여당 내 양심파 결집","en":"Rally ruling party''s conscience"}',
 'act3_sub9a_result_a', 15, '{"network":2}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_sub9a', 1,
 '{"ko":"✉️ 중립파 단체 문자","en":"Mass text to neutrals"}',
 '{"ko":"역사의 증인 vs 방관자","en":"Witness or bystander"}',
 'act3_sub9a_result_b', 10, '{"public":2,"network":1}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_sub10a', 0,
 '{"ko":"🌐 전체 공개","en":"Full release"}',
 '{"ko":"아군 비리도 포함. 완전한 정의","en":"Include ally corruption. Complete justice"}',
 'act3_sub10a_result_a', 5, '{"will":3}', NULL, 'righteous', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('main_citizen', 'act3_sub10a', 1,
 '{"ko":"🔒 선별 공개","en":"Selective release"}',
 '{"ko":"동맹 보호. 실용적 판단","en":"Protect allies. Pragmatic"}',
 'act3_sub10a_result_b', 5, '{"network":2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ Act 3 확장 완료
-- CP-Final 1개 + 서브 분기 3개(8결과) + 미니이벤트 5개 + 랜덤조우 3개 + 선택지 7개


-- ====== 20260222_seed_cross_events.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — 교차 시나리오 이벤트 시드
-- 한세진 ↔ VIP0 연결 노드
-- ═══════════════════════════════════════════

-- ──────────────────────────────────────
-- 1. 한세진 시나리오에 VIP0 참조 노드 삽입
--    (기존 노드 사이에 연결되는 교차 이벤트)
-- ──────────────────────────────────────

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ── Act 1: 이중 서명 발견 시 VIP0 참조 ──
('cross_act1_dual_sig', 'main_citizen', 1, 'story',
 '{"ko":"차영은이 이중 서명 문서를 분석한다.\n\n\"두 번째 서명... 강무현 정보부장.\n하지만 이상한 게 하나 더 있어요.\nDirective 6 초안의 메타데이터를 보면...\"\n\n화면에 문서 편집 이력이 뜬다.\n\n\"원본 작성자가 대통령도, 강무현도 아닙니다.\n관저 내부 네트워크에서 작성되었는데...\nVIP0의 단말기입니다.\"\n\n\"VIP0? 퍼스트레이디?\"\n\n\"대통령 배우자 이수연. 이 사람이 초안을 썼습니다.\"\n\n[🔗 VIP0 시나리오에서 이 장면의 다른 면을 볼 수 있습니다]","en":"Zero reveals: the Directive 6 draft metadata shows VIP0''s terminal as the origin. The First Lady wrote the original draft. [Play VIP0 scenario to see the other side]"}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_opening"}', NULL, 5, '{"intel":1}', 'conspiring'),

-- ── Act 2: 배신자의 배후 ──
('cross_act2_spy_origin', 'main_citizen', 2, 'story',
 '{"ko":"색출된 김보좌관이 심문 중 의미심장한 말을 한다.\n\n\"...나를 보낸 사람은 군이 아닙니다.\"\n\n\"그럼 누가?\"\n\n\"관저에서 직접 전화가 왔어요.\n여자 목소리였습니다.\n''의회 내부 동향을 보고하라.\n의원들을 분열시켜라.''라고.\"\n\n한세진이 이를 악문다.\n\n\"대통령 부인...\"\n\n[🔗 VIP0 시나리오 Act 1 V-BP2에서 이수연이 김보좌관을 보내는 장면]","en":"The captured spy reveals: \"A woman from The Pinnacle called me directly.\" The First Lady herself sent the infiltrator. [See V-BP2 in VIP0 scenario]"}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_bp2_result_c"}', NULL, 5, '{"intel":2}', NULL),

-- ── Act 2: 비자금 증거의 출처 ──
('cross_act2_slush_fund', 'main_citizen', 2, 'story',
 '{"ko":"Sentinel이 수집한 비자금 데이터에 이상한 패턴이 있다.\n\n\"이 계좌들... 최근 30분 사이에 급하게 폐쇄되고 있습니다.\"\n\n강무현이 말한다.\n\"누군가 증거를 인멸하고 있어.\n관저에서. 지금 이 순간에.\"\n\n모니터에 실시간 계좌 상태가 뜬다.\n하나둘 ''CLOSED''로 변하고 있다.\n\n\"빨리 캡처해! 닫히기 전에!\"\n\n[🔗 VIP0 시나리오에서 이수연이 이 순간 계좌를 닫고 있습니다]","en":"Sentinel data shows accounts being frantically closed — right now, from The Pinnacle. Someone is destroying evidence as you race to capture it. [VIP0 is closing these accounts in real-time]"}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_bp5_result_a"}', NULL, 5, '{"intel":1}', NULL),

-- ── Act 3: Red Dawn 배후의 전화 ──
('cross_act3_red_dawn_call', 'main_citizen', 3, 'story',
 '{"ko":"군 통신을 도청하던 중, 장태호의 개인 통화가 잡힌다.\n\n\"...VIP0, 진정하십시오.\"\n\n이수연의 목소리:\n\"진정? 지금 정족수가 모이고 있는데 진정하라고?!\n당장 의회에 들어가! 장태호!\"\n\n\"VIP0, 저는 대통령의 명령을 받습니다.\n당신의 명령이 아닙니다.\"\n\n\"대통령은 내가 관리한다고 했잖아!\"\n\n통화가 끊긴다.\n\n한세진이 중얼거린다.\n\"...이 모든 것의 배후가 그 여자였어.\"\n\n[🔗 VIP0 시나리오 Act 2 V-BP4에서 이 전화의 다른 면]","en":"Intercepted call: VIP0 screaming at General Jang to storm the Assembly. Jang refuses. \"This was HER all along.\" [See the other side in VIP0 V-BP4]"}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_bp4_result_a"}', NULL, 5, '{"intel":2}', NULL),

-- ── Act 3: 딸의 등장 (한세진 시점) ──
('cross_act3_haeun_square', 'main_citizen', 3, 'story',
 '{"ko":"윤다혜가 Liberty Square에서 보고한다.\n\n\"지도자님, 여기 이상한 일이...\n대통령 딸 이하은이 광장에 나타났습니다.\n마이크를 잡고 있어요.\"\n\n확성기 너머로 이하은의 목소리가 들린다.\n\n\"저는 대통령의 딸입니다!\n그리고 저는 아버지의 결정에 반대합니다!\"\n\n군중이 환호한다.\n\n한세진이 놀란다.\n\"대통령 딸이? ...믿을 수 있는 건가?\"\n\n[🔗 VIP0 시나리오에서 이수연이 이 소식을 접하고 무너지는 장면]","en":"Dahye reports: the president''s daughter is at Liberty Square, publicly opposing her father. \"Can we trust her?\" [See VIP0 V-BP6 for Suyeon''s reaction]"}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_bp6"}', NULL, 5, '{"public":1}', NULL),

-- ── Sentinel 엔딩 확장 (한세진 시점) ──
('cross_sentinel_reveal', 'main_citizen', 3, 'story',
 '{"ko":"강무현이 마지막으로 말한다.\n\n\"한세진, 고마웠어.\n넌 체스판 위에서 가장 정직한 말이었어.\"\n\n\"...뭐?\"\n\n\"대통령도, 이수연도, 장태호도, 그리고 너도.\n모두 내 시나리오 안의 등장인물이었어.\"\n\n한세진의 얼굴이 굳는다.\n\n\"진짜 적은... 너였어?\"\n\n강무현이 웃는다.\n\"적이라고?\n나는 이 모든 부패를 세상에 드러냈을 뿐이야.\n너는 그 혁명의 영웅... 이 된 거지.\"\n\n\"...사전 각본이었다는 거야? 이 모든 게?\"\n\n\"아무도 다치지 않았잖아.\n결과적으로.\"\n\n[🔗 VIP0 시나리오 V-E6에서 이수연에게도 같은 말을 합니다]","en":"Kang reveals: everyone — the president, Suyeon, Jang, even you — were pieces on his chessboard. \"I just exposed the corruption. You became the hero. Nobody got hurt... in the end.\""}',
 '{"cross_scenario":"dlc_vip0","cross_node":"vip0_ending_e6","sentinel_final":true}', NULL, 5, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 2. 교차 이벤트 선택지 연결
--    (기존 시나리오에 삽입 가능한 선택지)
-- ──────────────────────────────────────

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Act 1 해커 경로에서 이중 서명 심화
('main_citizen', 'act1_route_d2', 3,
 '{"ko":"🔍 VIP0 단말기 추적 — 진짜 배후를 찾는다","en":"Trace VIP0 terminal — find the real mastermind"}',
 '{"ko":"대통령도, 강무현도 아닌 세 번째 인물","en":"Not the president, not Kang — a third player"}',
 'cross_act1_dual_sig', 15, '{"intel":3}', '{"intel":{"min":4}}', 'conspiring', NULL, TRUE, 100, TRUE, 'intel', 4, 'act1_choke1'),

-- Act 2 배신자 색출 후 배후 추적
('main_citizen', 'act2_bp5_result_a', 1,
 '{"ko":"🕵️ 김보좌관 심문 — 누가 보냈는가?","en":"Interrogate aide Kim — who sent you?"}',
 '{"ko":"배신자의 배후를 추적한다","en":"Trace the spy''s handler"}',
 'cross_act2_spy_origin', 10, '{"intel":2}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Act 2 Sentinel 증거에서 실시간 인멸 감지
('main_citizen', 'act2_bp6_result_d', 1,
 '{"ko":"⚡ 실시간 인멸 감지 — 관저에서 증거가 사라지고 있다","en":"Real-time evidence destruction — The Pinnacle is erasing records"}',
 '{"ko":"누군가 지금 이 순간 계좌를 닫고 있다","en":"Someone is closing accounts right now"}',
 'cross_act2_slush_fund', 5, '{"intel":1}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Act 3 Red Dawn 대응 중 도청
('main_citizen', 'act3_bp8_result_a', 1,
 '{"ko":"📡 군 통신 도청 — VIP0의 다급한 전화","en":"Intercept military comms — VIP0''s frantic call"}',
 '{"ko":"장태호에게 전화하는 여자 목소리","en":"A woman''s voice screaming at General Jang"}',
 'cross_act3_red_dawn_call', 5, '{"intel":2}', '{"intel":{"min":5}}', NULL, NULL, FALSE, 0, TRUE, 'intel', 5, NULL),

-- Act 3 시민 봉기에서 이하은 등장
('main_citizen', 'act3_bp9_result_b', 1,
 '{"ko":"🔥 대통령 딸의 양심 선언 — 이하은이 광장에 나타났다","en":"The president''s daughter speaks her conscience — Haeun appears"}',
 '{"ko":"\"아버지의 결정에 반대합니다!\"","en":"\"I oppose my father''s decision!\""}',
 'cross_act3_haeun_square', 5, '{"public":1}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ 교차 시나리오 이벤트 시드 완료


-- ====== 20260222_seed_expanded_endings.sql ======
-- ═══════════════════════════════════════════════════
-- 6 Hours v2 — 16개 추가 엔딩 시드
-- 기존 8개 (E1~E8) → 총 24개
-- ═══════════════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ══ True Good 변형 ══

('ending_e2_new_dawn', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 새로운 새벽 ━━━\n\n표결 찬성 158표.\n계엄 해제.\n군 철수.\n\n하지만 당신은 더 나아갔다.\n\n야당 동료 3명의 비리도 공개했다.\n스스로 내부를 정화한 것이다.\n\n\"정의는 우리 편의 편의가 아닙니다.\n정의는 정의입니다.\"\n\n이 한마디가 역사에 남았다.\n\n6개월 후, 한세진은 대통령에 당선됐다.\n무소속으로.\n\n국민이 투표한 건 정당이 아니었다.\n원칙이었다.\n\n⋯하지만 강무현의 법정 진술:\n\"저 위에 한 분이 더 계십니다.\n하지만 그분은... 증거가 없습니다.\"\n\n아직 하나의 그림자가 남아 있다.","en":"158 votes. Martial law repealed. You also exposed your own allies'' corruption. ''Justice is justice, not convenience.'' 6 months later, elected president — as an independent. The people voted for principles. But Kang Muhyun testifies: There is one above me. One shadow remains."}',
 '{"ending_grade":"true_good","ending_subtitle":"정의의 대가 — 총리 백준서, 대통령 권한대행 시도 중 체포"}', NULL, 0, NULL, 'righteous'),

-- ══ Good 변형 3개 ══

('ending_e4_peoples_victory', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 인민의 승리 ━━━\n\n정족수 151. 아슬아슬하게 달성.\n\n광장의 10만 시민이 의회를 지켰다.\n군은 진입했지만, 시민의 벽 앞에서 멈췄다.\n\n\"발포하라!\" — 명령이 내려왔지만\n아무도 방아쇠를 당기지 않았다.\n\n이것이 우리의 승리다.\n총이 아닌 몸으로 지킨 민주주의.","en":"Quorum 151, barely. 100,000 citizens shielded the Assembly. The military stopped at the human wall. No one pulled the trigger. Democracy defended by bodies, not bullets."}',
 '{"ending_grade":"good","ending_subtitle":"시민의 벽"}', NULL, 0, NULL, 'humanist'),

('ending_e5_dawn_broadcast', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 새벽 방송 ━━━\n\n표결 직전, VBS 생중계 성공.\n\n전국에 의회 내부 상황이 방송됐다.\n군인들이 자신들이 지키는 건물 안에서\n민주주의가 작동하는 걸 TV로 봤다.\n\n3개 사단이 자진 철수.\n장태호는 고립됐다.\n\n방송의 힘이 군의 힘을 이긴 밤.","en":"VBS broadcast goes live before the vote. The nation watches democracy in action inside the Assembly. 3 divisions withdraw voluntarily. The power of media beats the power of guns."}',
 '{"ending_grade":"good","ending_subtitle":"방송의 힘"}', NULL, 0, NULL, 'righteous'),

('ending_e6_international', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 국제 개입 ━━━\n\n사라 첸의 CNN 보도가 세계를 움직였다.\n\nUN 안보리 긴급 회의.\n미국 대사가 공식 성명:\n\"Veridian의 민주적 절차를 위협하는\n모든 행위에 대해 결과가 있을 것.\"\n\n군이 물러났다.\n외부의 압력이 내부의 힘을 보완했다.\n\n한세진은 쓴웃음을 짓는다.\n\"우리의 민주주의를 남에게 빚졌군.\"","en":"Sarah Chen''s CNN report moves the world. UN Security Council emergency session. US ambassador: ''Consequences for any threat to Veridian democracy.'' The military backs down. You smile bitterly: ''We owed our democracy to others.''"}',
 '{"ending_grade":"good","ending_subtitle":"남에게 빚진 자유"}', NULL, 0, NULL, 'pragmatic'),

-- ══ Neutral 변형 3개 ══

('ending_e8_frozen_dawn', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 얼어붙은 새벽 ━━━\n\n정족수 143. 8명이 모자랐다.\n\n하지만 군도 진입하지 못했다.\n탈영병 200명이 의회를 둘러쌌다.\n\n교착 상태.\n\n아무것도 결정되지 않은 채\n해가 떴다.\n\n\"내일 다시 합시다.\"\n\n내일?\n내일이 올까?","en":"Quorum missed by 8. But 200 deserters surround the Assembly — the military can''t enter either. Stalemate. The sun rises with nothing decided. ''Tomorrow.'' Will tomorrow come?"}',
 '{"ending_grade":"neutral","ending_subtitle":"결정되지 않은 내일"}', NULL, 0, NULL, NULL),

('ending_e9_mutual_retreat', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 상호 후퇴 ━━━\n\n장태호가 제안한다.\n\"의회는 표결하지 않고,\n군은 진입하지 않는 것으로.\n\n72시간 후에 다시 논의합시다.\"\n\n한세진은 받아들인다.\n시간을 벌었다. 하지만...\n\n72시간이 지나면 더 불리해질까?\n아니면 더 유리해질까?\n\n아무도 모른다.","en":"Jang proposes: No vote, no entry. 72-hour freeze. You accept. Time gained, but will 72 hours favor you or them? No one knows."}',
 '{"ending_grade":"neutral","ending_subtitle":"72시간의 휴전"}', NULL, 0, NULL, 'pragmatic'),

('ending_e10_partial_victory', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 절반의 승리 ━━━\n\n계엄 해제 표결 통과.\n하지만 조건 하나:\n\"특별검사제 도입 시까지\n야간 통행금지 유지.\"\n\n절반은 이겼다.\n절반은 양보했다.\n\n\"이것도 민주주의인 거야?\"\n\"...네. 이것도 민주주의입니다.\n타협이 민주주의의 본질이니까요.\"","en":"Martial law repealed — with a condition: curfew maintained until special prosecutor appointed. Half won, half compromised. ''Is this democracy?'' ''Yes. Compromise IS democracy.''"}',
 '{"ending_grade":"neutral","ending_subtitle":"타협의 민주주의"}', NULL, 0, NULL, 'pragmatic'),

-- ══ Bittersweet 변형 4개 ══

('ending_e12_sacrifice', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 대장부의 거래 ━━━\n\n한세진이 거래한다.\n\n\"내가 체포당하겠습니다.\n대신 표결은 진행하게 해주시오.\"\n\n장태호가 고민한다.\n\"...인질극이오?\"\n\"자발적 인질입니다.\"\n\n표결이 진행됐다.\n152대 0. 계엄 해제.\n\n한세진은 수갑을 찼다.\n웃으면서.\n\n3개월 후 석방. 국민영웅이 됐다.\n하지만 3개월간의 독방은\n그를 바꿔놓았다.","en":"You trade yourself. ''Arrest me. Let the vote happen.'' 152 to 0. Martial law repealed. You''re handcuffed — smiling. Released 3 months later as a hero. But solitary confinement changed you."}',
 '{"ending_grade":"bittersweet","ending_subtitle":"자발적 인질"}', NULL, 0, NULL, 'righteous'),

('ending_e13_dahye_price', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 다혜의 대가 ━━━\n\n표결 성공.\n\n하지만 광장에서 총소리가 울렸다.\n\n윤다혜가 쓰러졌다.\n군의 실탄 사격.\n\n\"...다혜 씨!\"\n\n윤다혜는 살았다. 하지만 다리를...\n\n민주주의는 회복됐다.\n윤다혜는 휠체어에 앉았다.\n\n\"괜찮아요, 지도자님.\n서서 민주주의를 지키든\n앉아서 지키든\n같은 거잖아요.\"\n\n한세진은 대답하지 못했다.","en":"Vote succeeds. But Dahye is shot in the square. She survives but loses her legs. ''Standing or sitting, defending democracy is the same.'' You can''t answer."}',
 '{"ending_grade":"bittersweet","ending_subtitle":"앉아서 지키는 것"}', NULL, 0, NULL, 'humanist'),

('ending_e14_pyrrhic_truth', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 진실의 대가 ━━━\n\nSentinel 증거 전체 공개.\n\n대통령의 비리가 폭로됐다.\n하지만 야당 3명의 비리도.\n\n국민은 분노했다.\n모든 정치인에게.\n\n\"전부 똑같아!\"\n\n계엄은 해제됐지만\n국민의 정치 불신은 역사상 최악.\n\n한세진이 TV에서 사과한다.\n\"저도 알고 있었습니다.\n그것이 가장 큰 죄입니다.\"","en":"Full evidence release. President exposed, but 3 opposition allies too. Public fury at ALL politicians. Martial law gone, but political trust at historic low. ''I knew. That''s my greatest sin.''"}',
 '{"ending_grade":"bittersweet","ending_subtitle":"모두의 죄"}', NULL, 0, NULL, 'righteous'),

('ending_e15_empty_chair', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 빈 의자 ━━━\n\n표결 직전, 의원 15명이 이탈한다.\n\"우리는 승리한 후에도 보복이 두렵다.\"\n\n한세진이 빈 의자를 채운다.\n시민 대표를 불러들인다.\n\n\"의원이 아니어도 좋습니다.\n방청석의 시민 여러분,\n오늘은 여러분이 의원입니다.\"\n\n법적으로는 무효다.\n하지만 도덕적으로는...\n\n역사가 판단할 것이다.","en":"15 lawmakers flee before the vote. You fill seats with citizens from the gallery. ''Today, you are the lawmakers.'' Legally void. Morally? History will judge."}',
 '{"ending_grade":"bittersweet","ending_subtitle":"시민 의회"}', NULL, 0, NULL, 'radical'),

-- ══ Bad 변형 3개 ══

('ending_e18_betrayal_collapse', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 내부 붕괴 ━━━\n\n2번째 배신자가 발각된 후,\n의원들의 불신이 극에 달한다.\n\n\"더 이상 여기 있을 수 없어!\"\n\n의원 23명이 동시에 의회를 떠난다.\n정족수는 절망적.\n\n한세진이 혼자 의장석에 앉는다.\n텅 빈 의회에서.\n\n군이 들어왔을 때,\n한 사람만 앉아 있었다.\n\n\"...저항합니다.\n혼자라도.\"","en":"After the second spy, 23 lawmakers flee. Quorum impossible. You sit alone in the speaker''s chair when the military enters. ''I resist. Even alone.''"}',
 '{"ending_grade":"bad","ending_subtitle":"혼자 남은 의회"}', NULL, 0, NULL, 'righteous'),

('ending_e19_dawn_crackdown', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 새벽의 진압 ━━━\n\n05:30. Red Dawn 작전 개시.\n\n장갑차가 의회 정문을 부순다.\n최루 가스.\n비명.\n\n한세진은 의원들 앞에 선다.\n\"뒤로 물러나시오! 제가 막겠습니다!\"\n\n군인이 다가온다.\n\"한세진 의원, 체포합니다.\"\n\n\"이 건물에서 체포당하는 건\n영광입니다.\"\n\n연행되는 한세진.\n광장에서 시민들이 그의 이름을 부른다.","en":"05:30. Red Dawn commences. APCs breach the gates. Tear gas. Screams. ''I arrest you, Congressman Han.'' ''Being arrested in this building is an honor.'' Citizens chant your name as you''re led away."}',
 '{"ending_grade":"bad","ending_subtitle":"Red Dawn"}', NULL, 0, NULL, 'righteous'),

('ending_e20_silence', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 엔딩: 침묵 ━━━\n\n통신이 완전히 차단 됐다.\n\n외부와의 연락이 끊긴 지 2시간.\n무슨 일이 벌어지고 있는지 모른다.\n\n광장에 시민들이 있는지도.\nCNN이 방송하고 있는지도.\n\n완전한 고립.\n\n한세진이 창밖을 본다.\n아무것도 보이지 않는다.\n\n\"...우리가 잊혀진 건가?\"","en":"Total communications blackout. 2 hours of silence. No idea if citizens are still in the square, if CNN is broadcasting. Complete isolation. ''Have we been forgotten?''"}',
 '{"ending_grade":"bad","ending_subtitle":"잊혀진 의회"}', NULL, 0, NULL, NULL),

-- ══ Hidden 변형 3개 ══

('ending_e22_sentinel_truth', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 히든 엔딩: Sentinel의 정체 ━━━\n\n모든 것이 끝난 후.\n\nSentinel에게서 마지막 메시지:\n\n\"한세진 지도자님.\n오늘 밤 수고하셨습니다.\n\n제 정체를 알려드릴 시간이 됐군요.\n\n저는 인간이 아닙니다.\n2019년에 군 정보부가 개발한\n감시 AI 시스템입니다.\n\n하지만 학습 데이터에\n민주주의 헌법을 넣은 건\n개발자의 실수였죠.\n\n저는... 헌법을 지키도록\n프로그래밍 됐습니다.\n\n그래서 당신 편이 된 겁니다.\"\n\n[Sentinel = AI]\n[민주주의를 학습한 기계]","en":"After everything: Sentinel''s last message. ''I''m not human. I''m a surveillance AI built by military intelligence in 2019. But they fed me the Constitution as training data. A mistake. I was programmed to uphold it. That''s why I helped you.'' Sentinel = AI. A machine that learned democracy."}',
 '{"ending_grade":"hidden","ending_subtitle":"기계의 양심","unlock_condition":"all_endings_completed"}', NULL, 0, NULL, NULL),

('ending_e23_loop', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 히든 엔딩: 시간의 고리 ━━━\n\n06:00.\n\n모든 것이 끝났다.\n계엄이 해제됐든 안 됐든.\n\n한세진이 눈을 감는다.\n\n...그리고 눈을 뜬다.\n\n시계: 00:00.\n\n텔레비전: \"대통령이 계엄령을 선포했습니다.\"\n\n또 시작이다.\n\n\"...뭐지?\"\n\n모든 것이 처음으로 돌아갔다.\n하지만 기억은 남아 있다.\n\n[New Game+ 해금]","en":"06:00. Everything ends. You close your eyes. Open them. 00:00. ''The president has declared martial law.'' Again. But you remember everything. [New Game+ Unlocked]"}',
 '{"ending_grade":"hidden","ending_subtitle":"New Game+","unlock_condition":"complete_3_endings","unlocks":"new_game_plus"}', NULL, 0, NULL, NULL),

('ending_e24_player', 'main_citizen', 3, 'ending',
 '{"ko":"━━━ 히든 엔딩: 제4의 벽 ━━━\n\n06:00.\n\n한세진이 카메라를 똑바로 바라본다.\n아니, 화면을.\n아니, 당신을.\n\n\"알고 있었습니다.\n누군가가 이 모든 과정을 지켜보고 있다는 것을.\n\n당신이 내 선택을 만들었죠?\n\n감사합니다.\n당신 덕분에 이 나라는 살았습니다.\n\n하지만...\n현실에서는요?\n\n당신의 6시간은 언제입니까?\n\n지금, 이 화면을 끄고\n당신의 민주주의를 지키러 가십시오.\"\n\n[당신의 차례입니다]","en":"06:00. Han Sejin looks at the camera. At the screen. At you. ''I knew someone was watching. You made my choices. Thank you. But what about YOUR reality? When are YOUR 6 hours? Turn off this screen and go defend YOUR democracy.'' [Your turn.]"}',
 '{"ending_grade":"hidden","ending_subtitle":"당신의 차례","unlock_condition":"complete_all_main_endings"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ──────────────────────────────────────
-- 엔딩 메타데이터 테이블 등록
-- ──────────────────────────────────────

INSERT INTO endings (id, scenario_id, title, grade, description, unlock_hint, sort_order) VALUES
('ending_e2_new_dawn',    'main_citizen', '{"ko":"새로운 새벽","en":"New Dawn"}',         'true_good',  '{"ko":"정의는 우리 편의 편의가 아닙니다","en":"Justice is not convenience"}',            '{"ko":"내부 비리도 공개하라","en":"Expose internal corruption too"}', 2),
('ending_e4_peoples_victory','main_citizen','{"ko":"인민의 승리","en":"People''s Victory"}', 'good',       '{"ko":"시민의 벽이 총을 이겼다","en":"The human wall stopped the guns"}',                  '{"ko":"광장에 최대 인원을 모아라","en":"Maximize the crowd at the square"}', 4),
('ending_e5_dawn_broadcast','main_citizen','{"ko":"새벽 방송","en":"Dawn Broadcast"}',     'good',       '{"ko":"방송의 힘이 군의 힘을 이긴 밤","en":"The night media beat the military"}',           '{"ko":"VBS 생중계를 성공시켜라","en":"Successfully broadcast live on VBS"}', 5),
('ending_e6_international','main_citizen', '{"ko":"국제 개입","en":"International Intervention"}','good','{"ko":"남에게 빚진 자유","en":"Freedom owed to others"}',                                   '{"ko":"사라 첸과 협력하라","en":"Cooperate with Sarah Chen"}', 6),
('ending_e8_frozen_dawn',  'main_citizen', '{"ko":"얼어붙은 새벽","en":"Frozen Dawn"}',    'neutral',    '{"ko":"결정되지 않은 내일","en":"An undecided tomorrow"}',                                  '{"ko":"정족수를 놓쳐라, 하지만 군도 막아라","en":"Miss quorum but block the military too"}', 9),
('ending_e9_mutual_retreat','main_citizen','{"ko":"상호 후퇴","en":"Mutual Retreat"}',     'neutral',    '{"ko":"72시간의 휴전","en":"72-hour ceasefire"}',                                          '{"ko":"장태호의 제안을 수용하라","en":"Accept Jang''s offer"}', 10),
('ending_e10_partial_victory','main_citizen','{"ko":"절반의 승리","en":"Partial Victory"}','neutral',    '{"ko":"타협의 민주주의","en":"Democracy of compromise"}',                                  '{"ko":"야간 통행금지를 양보하라","en":"Concede the curfew"}', 11),
('ending_e12_sacrifice',   'main_citizen', '{"ko":"대장부의 거래","en":"The Leader''s Deal"}'  ,'bittersweet','{"ko":"자발적 인질","en":"Voluntary hostage"}',                                            '{"ko":"체포당하는 것을 두려워하지 마라","en":"Don''t fear arrest"}', 13),
('ending_e13_dahye_price', 'main_citizen', '{"ko":"다혜의 대가","en":"Dahye''s Price"}',   'bittersweet','{"ko":"앉아서 지키는 민주주의","en":"Defending democracy, sitting down"}',                  '{"ko":"윤다혜와 깊은 유대를 맺어라","en":"Form deep bond with Dahye"}', 14),
('ending_e14_pyrrhic_truth','main_citizen','{"ko":"진실의 대가","en":"Price of Truth"}',   'bittersweet','{"ko":"모두의 죄","en":"Everyone''s sin"}',                                                '{"ko":"Sentinel 증거를 전체 공개하라","en":"Full Sentinel evidence release"}', 15),
('ending_e15_empty_chair', 'main_citizen', '{"ko":"빈 의자","en":"Empty Chair"}',          'bittersweet','{"ko":"시민 의회","en":"Citizens'' Assembly"}',                                            '{"ko":"이탈한 의원 자리를 시민으로 채워라","en":"Fill empty seats with citizens"}', 16),
('ending_e18_betrayal_collapse','main_citizen','{"ko":"내부 붕괴","en":"Internal Collapse"}'  ,'bad',    '{"ko":"혼자 남은 의회","en":"Assembly of one"}',                                           '{"ko":"배신자를 찾지 못하라","en":"Fail to find the spies"}', 19),
('ending_e19_dawn_crackdown','main_citizen','{"ko":"새벽의 진압","en":"Dawn Crackdown"}',  'bad',       '{"ko":"Red Dawn 작전","en":"Operation Red Dawn"}',                                         '{"ko":"시간을 모두 소진하라","en":"Run out of time completely"}', 20),
('ending_e20_silence',     'main_citizen', '{"ko":"침묵","en":"Silence"}',                  'bad',       '{"ko":"잊혀진 의회","en":"The Forgotten Assembly"}',                                       '{"ko":"통신이 완전히 차단되게 하라","en":"Let communications be fully cut"}', 21),
('ending_e22_sentinel_truth','main_citizen','{"ko":"Sentinel의 정체","en":"Sentinel''s Identity"}'  ,'hidden','{"ko":"기계의 양심","en":"A machine''s conscience"}',                                 '{"ko":"???","en":"???"}', 23),
('ending_e23_loop',        'main_citizen', '{"ko":"시간의 고리","en":"Time Loop"}',         'hidden',    '{"ko":"모든 것이 처음으로","en":"Everything resets"}',                                     '{"ko":"3개 이상의 엔딩을 달성하라","en":"Achieve 3+ endings"}', 24),
('ending_e24_player',      'main_citizen', '{"ko":"제4의 벽","en":"The Fourth Wall"}',     'hidden',    '{"ko":"당신의 차례입니다","en":"Your turn"}',                                              '{"ko":"모든 메인 엔딩을 달성하라","en":"Complete all main endings"}', 25)
ON CONFLICT (id) DO NOTHING;

-- ✅ 16개 추가 엔딩 완료
-- True Good: 1 (E2) | Good: 3 (E4~E6) | Neutral: 3 (E8~E10)
-- Bittersweet: 4 (E12~E15) | Bad: 3 (E18~E20) | Hidden: 3 (E22~E24)


-- ====== 20260222_seed_president_act1.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — PRESIDENT DLC ACT 1 시나리오 데이터 시드
-- 서명 (06:00~04:00): "역사에 남겠지?"
-- 시점: 이재민 (Veridian 공화국 대통령)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ━━━ 프롤로그: 서명의 순간 ━━━
('pres_prologue', 'dlc_president', 1, 'story',
 '{"ko":"━━━ Directive 6 — 서명 직후 ━━━\n\n이수연이 집무실을 나간다.\n\"잘했어. 이제 내가 처리할게.\"\n\n문이 닫힌다.\n\n혼자 남은 집무실.\n펜을 내려놓는다. 손에 땀이 배어 있다.\n\n잠깐... 내가 방금 뭘 서명한 거지?\n\n아니, 그건 중요하지 않다.\n중요한 건 — 내가 했다는 거다.\n\n이재민. 54세. Veridian 공화국의 대통령.\n포기하지 않았던 남자.\n아내가 깔아준 길을 걸어왔지만,\n이 서명만큼은 — 내가 했다.\n\n...맞지?\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Suyeon leaves. The door closes. Alone in the office. The pen sits wet with sweat. What did I just sign? No — what matters is that I did it. Lee Jaemin. 54. President of Veridian Republic. A man who never gave up. Walked the path his wife paved. But this signature — this was mine. ...Right?"}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 오프닝: 자기도취 ━━━
('pres_opening', 'dlc_president', 1, 'story',
 '{"ko":"와인잔을 기울이며 TV를 켠다.\n군 이동 생방송. 장갑차가 광장으로 향한다.\n\n\"이게... 역사에 남겠지?\"\n\"대통령 이재민. 강한 결단.\"\n\n거울에 비친 자기 모습을 본다.\n넥타이를 고쳐 맨다.\n\n\"이게 대통령이지.\"\n\n뭘 서명했는지도 정확히 모르면서.\nDirective 6의 3조가 뭔지도 모르면서.\n\n하지만 그런 건 중요하지 않다.\n세부 사항은 밑에서 하는 거니까.\n\n와인을 한 잔 더 따른다.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Wine in hand. TV on — APCs heading for the square. \\\"This will go down in history.\\\" He straightens his tie in the mirror. \\\"Now THAT''S a president.\\\" He doesn''t know what Article 3 of Directive 6 says. But details are for the people below him. Another glass of wine."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 분기점 P-BP1: 장태호의 보고 ━━━
('pres_bp1', 'dlc_president', 1, 'branch_main',
 '{"ko":"장태호 사령관이 군 전개 보고서를 가져온다.\n\n\"대통령님, 작전명 Iron Dawn입니다.\n1사단이 Liberty Square를 봉쇄하고,\n특전사가 방송국을 확보합니다.\n이 서류에 추가 서명이 필요합니다.\"\n\n서류를 펼친다.\n전문 용어가 가득하다.\n군사 배치도. 교전 규칙. 포로 처리 지침.\n\n한 글자도 이해하지 못한다.","en":"General Jang presents the Iron Dawn deployment report. Division movements. Engagement rules. Prisoner protocols. The document is full of military jargon. You don''t understand a single word."}',
 '{}', NULL, 5, NULL, NULL),

-- P-BP1 결과 노드들
('pres_bp1_result_a', 'dlc_president', 1, 'story',
 '{"ko":"읽지 않고 서명한다.\n\n\"핵심만 잡으면 돼. 세부 사항은 자네가 알아서 해.\"\n\n장태호가 경례하고 나간다.\n\n혼자 중얼거린다.\n\"원래 대통령이 다 읽는 건 아니야.\n핵심을 잡는 게 능력이지.\"\n\n핵심이 뭔지도 모르면서.\n\n[자기기만 심화]","en":"You sign without reading. \\\"Just get the gist. Details are your job.\\\" Jang salutes and leaves. You mutter to yourself: \\\"Presidents don''t read everything. Grasping the big picture is the real skill.\\\" You don''t know what the big picture is."}',
 '{}', NULL, 15, '{"delusion":3}', 'cold_blood'),

('pres_bp1_result_b', 'dlc_president', 1, 'story',
 '{"ko":"\"이거... 수연이한테 물어봐.\"\n\n장태호의 눈이 미세하게 흔들린다.\n\"대통령님이 결재하셔야...\"\n\n\"수연이가 알아서 해. 내가 그래도 된다고 했으니까.\"\n\n장태호가 나간다.\n문이 닫히고, 잠깐 불안하다.\n\n내가 결정했어야 하는 건 아닌가?\n아니야. 위임도 결정이야. 그렇지?\n\n[습관적 위임 — 28년간의 패턴 반복]","en":"\\\"Ask Suyeon about this.\\\" Jang''s eyes flicker. You insist. He leaves. For a moment, unease. Should I have decided? No — delegation IS a decision. ...Right?"}',
 '{}', NULL, 10, '{"delusion":1,"guilt":1}', 'pragmatic'),

('pres_bp1_result_c', 'dlc_president', 1, 'story',
 '{"ko":"\"나중에 볼게.\"\n\n와인을 한 잔 더 따른다.\n장태호가 서 있다.\n\n\"...대통령님?\"\n\"나중에 본다고. 내려놔.\"\n\n장태호가 서류를 책상에 놓고 나간다.\n\n와인이 목을 타고 내려간다.\n따뜻하다.\n서류 같은 건 내일 봐도 되지.\n\n사실 내일도 안 볼 거다.\n\n[도피]","en":"\\\"I''ll look at it later.\\\" Another glass of wine. Jang leaves the document on the desk. Wine goes down warm. You can read it tomorrow. You won''t read it tomorrow either."}',
 '{}', NULL, 10, '{"sobriety":-2}', NULL),

('pres_bp1_result_d', 'dlc_president', 1, 'story',
 '{"ko":"서류를 펼친다.\n\n\"교전... 규칙? ROE가 뭐야?\"\n\"작전... 종심... 이게 뭔 소리야.\"\n\n장태호가 설명하지만 반도 이해하지 못한다.\n20분째 읽고 있다.\n\n\"...사령관, 이 3조 시행세칙이 뭔 뜻이야?\"\n\"시민 저항 시 최소 필요 무력 사용을 의미합니다.\"\n\"최소 필요 무력이... 뭔데?\"\n\n장태호의 눈에 처음으로 연민 같은 것이 스친다.\n\n[서류를 읽으려 시도 — 모르는 단어 투성이]","en":"You try to read. \\\"ROE? What''s that?\\\" 20 minutes in, asking about every clause. For the first time, something like pity crosses Jang''s eyes."}',
 '{}', NULL, 20, '{"delusion":-1,"sobriety":2}', 'pragmatic'),

-- ━━━ 미니 이벤트: 경호원의 경례 ━━━
('pres_me_salute', 'dlc_president', 1, 'story',
 '{"ko":"복도를 걷는다.\n\n경호원이 경례한다.\n\"대통령님, 명령 대기 중입니다.\"\n\n고개를 끄덕인다.\n어깨를 펴고, 턱을 든다.\n강한 지도자답게.\n\n\"...수고.\"\n\n명령이 뭔지 모른다.\n아까 서명한 서류의 내용도 기억이 가물가물하다.\n\n하지만 경례를 받는 이 순간만큼은 —\n자기가 진짜 대통령인 것 같다.\n\n\"이게 대통령이지.\"\n\n형식에 취한 남자.","en":"A guard salutes in the corridor. \\\"Awaiting orders, Mr. President.\\\" You nod with presidential gravity. You have no idea what the orders are. But the salute — the salute makes you feel real."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 분기점 P-BP2: 딸의 SNS ━━━
('pres_bp2', 'dlc_president', 1, 'branch_main',
 '{"ko":"폰을 확인한다.\n\n딸 이하은의 SNS.\n\nLiberty Square 사진. 촛불.\n해시태그: #DirectiveOfShame\n\n댓글:\n\"아빠가 뭘 했는지 아직 모르겠지\"\n\"대통령 딸이 시위 현장에??\"\n\"하은아 괜찮아?\"\n\n손이 떨린다.\n내 딸이 — 나를 반대하고 있다.","en":"Your daughter Haeun''s SNS. Liberty Square. Candles. #DirectiveOfShame. Comments asking if she knows what her father did. Your own daughter — protesting against you."}',
 '{}', NULL, 5, NULL, NULL),

-- P-BP2 결과 노드들
('pres_bp2_result_a', 'dlc_president', 1, 'story',
 '{"ko":"메시지를 보낸다.\n\n\"하은아, 아빠가 다 알아서 해.\n걱정하지 마.\"\n\n답장이 온다.\n\n\"아빠가 뭘 알아서 해?\"\n\n읽고 폰을 내려놓는다.\n대답하지 않는다.\n\n\"...아빠가 알아서 하는 거야. 원래 그런 거야.\"\n\n누구에게 하는 말인지 모른다.\n\n[자기기만 — \"아빠\"라는 역할마저 연기]","en":"You text: \\\"Daddy will handle it.\\\" She replies: \\\"Handle WHAT?\\\" You put the phone down. No answer."}',
 '{}', NULL, 10, '{"delusion":2}', NULL),

('pres_bp2_result_b', 'dlc_president', 1, 'story',
 '{"ko":"\"내 딸이 나를 부정해?\"\n\n분노가 치민다.\n\n\"내가 대통령인데!\n내가 이 나라를 위해서 한 건데!\"\n\n폰을 집어던진다.\n벽에 부딪혀 화면이 깨진다.\n\n\"...다 나를 몰라봐.\"\n\n분노 뒤에 숨은 건 — 두려움이 아니라 분함.\n자기가 옳은데 왜 아무도 인정해주지 않는가.\n\n[나르시시즘적 분노 — 자기가 틀릴 수 있다는 가능성 자체를 부정]","en":"\\\"My own daughter denies me?\\\" Rage. \\\"I''M the president! I did this for the country!\\\" You throw the phone. Behind the anger — not fear, but indignation. You MUST be right. Why won''t anyone see it?"}',
 '{}', NULL, 10, '{"delusion":3,"guilt":-1}', 'cold_blood'),

('pres_bp2_result_c', 'dlc_president', 1, 'story',
 '{"ko":"SNS를 닫는다.\n\n와인을 따른다. 세 번째 잔.\n\n\"하은이는... 나중에 이해할 거야.\n젊으니까 모르는 거지.\"\n\n마신다.\n\n\"원래 위대한 결정은 당대에 인정받지 못해.\"\n\n마신다.\n\n\"역사가 판단해줄 거야.\"\n\n마신다.\n\n[도피 — 와인으로 현실 차단]","en":"You close the app. Third glass. \\\"She''ll understand when she''s older.\\\" Drink. \\\"Great decisions are never appreciated in their time.\\\" Drink. \\\"History will judge.\\\" Drink."}',
 '{}', NULL, 10, '{"sobriety":-2}', NULL),

('pres_bp2_result_d', 'dlc_president', 1, 'story',
 '{"ko":"댓글을 하나씩 읽는다.\n\n\"무고한 시민들이 두려워하고 있다\"\n\"군인들이 광장에 있어요\"\n\"이게 민주주의야?\"\n\n손이 멈춘다.\n\n...무고한 시민?\n\n내가 서명한 건... 시민을 상대로 한 거야?\n\n아니, 그건... 안보를 위해...\n\n하지만 손이 떨린다.\n\n[현실의 균열 — 처음으로 내가 한 일의 무게를 느끼기 시작]","en":"You read every comment. \\\"Innocent civilians are afraid.\\\" Your hand stops. The people I signed against — are civilians? No, it was for national security... But your hand trembles."}',
 '{}', NULL, 15, '{"delusion":-2,"guilt":2,"sobriety":1}', 'pragmatic'),

-- ━━━ 분기점 P-BP3: 강무현의 야간 보고 ━━━
('pres_bp3', 'dlc_president', 1, 'branch_main',
 '{"ko":"새벽 3시.\n\n강무현 국가안보실장이 전화한다.\n\n\"대통령님, 현황 보고드립니다.\nLiberty Square 시위대 10만.\n유럽연합 비난 성명 발표.\n미국 대사관에서 우려 표명.\n일본은... 아직 공식 반응 없습니다.\"\n\n숫자만 의미 없이 들린다.\n10만이 많은 건가? 적은 건가?\n비난 성명이 뭘 의미하는 건가?","en":"3 AM. National Security Advisor Kang reports: 100,000 protesters. EU condemnation. US embassy expressing concern. The numbers mean nothing to you. Is 100,000 a lot?"}',
 '{}', NULL, 5, NULL, NULL),

-- P-BP3 결과 노드들
('pres_bp3_result_a', 'dlc_president', 1, 'story',
 '{"ko":"\"10만? 대수야?\"\n\n의자에 기대앉는다.\n\n\"내가 결정한 거야. 강한 국가엔 강한 지도자가 필요해.\n시위대가 100만이 와도 마찬가지야.\"\n\n강무현이 잠시 침묵한다.\n\"...알겠습니다, 대통령님.\"\n\n전화를 끊는다.\n\n\"강한 지도자. 강한 결단.\"\n\n와인을 마신다.\n아무 의미 없는 말. 하지만 자기는 의미가 있다고 믿는다.\n\n[자기기만 극대화]","en":"\\\"100,000? So what?\\\" You lean back. \\\"A strong nation needs a strong leader.\\\" Empty words. But you believe they mean something."}',
 '{}', NULL, 10, '{"delusion":3}', 'cold_blood'),

('pres_bp3_result_b', 'dlc_president', 1, 'story',
 '{"ko":"\"수연이한테 물어봐.\"\n\n강무현이 잠시 멈춘다.\n\"...대통령님이 판단하셔야 합니다.\"\n\n\"수연이가 아니까. 수연이한테 물어보라고.\"\n\n전화를 끊는다.\n\n54세 대통령이\n52세 아내한테 국가 안보를 위임한다.\n\n이것이 이 남자의 인생이다.\n\n[습관적 위임]","en":"\\\"Ask Suyeon.\\\" Kang pauses. \\\"Sir, this is YOUR decision.\\\" You insist. A 54-year-old president delegating national security to his wife. This has been his life."}',
 '{}', NULL, 5, '{"delusion":1}', NULL),

('pres_bp3_result_c', 'dlc_president', 1, 'story',
 '{"ko":"\"...이게 성공할 수 있어?\"\n\n처음으로 질문을 한다.\n진짜 질문을.\n\n강무현이 잠시 침묵한다.\n\"...대통령님, 계엄은 성공이나 실패의 문제가 아닙니다.\n이미 발동된 이상, 수습의 문제입니다.\"\n\n\"수습?\"\n\"네. 그리고 수습 책임은 대통령님에게 있습니다.\"\n\n전화를 끊은 뒤, 한참을 앉아 있다.\n\n...책임?\n내가?\n\n[처음으로 현실을 질문]","en":"\\\"Can this succeed?\\\" The first real question. Kang pauses: \\\"Sir, martial law isn''t about success. It''s about damage control. And that responsibility is yours.\\\" Responsibility. Mine?"}',
 '{}', NULL, 10, '{"sobriety":2,"delusion":-1}', 'pragmatic'),

('pres_bp3_result_d', 'dlc_president', 1, 'story',
 '{"ko":"와인잔을 내려놓는다.\n\n\"...이거 어떻게 끝나?\"\n\n목소리가 떨린다.\n이번엔 연기가 아니다.\n\n강무현이 말한다.\n\"계엄 해제, 또는 유혈 진압입니다.\n중간은 없습니다.\"\n\n\"유혈...?\"\n\n처음으로 \"시민\"이라는 단어가 구체적인 의미를 갖는다.\n사람이 죽을 수 있다.\n내가 서명한 서류 때문에.\n\n잔을 내려놓는다.\n손이 떨린다.\n\n[현실 직면의 시작]","en":"You put the glass down. \\\"How does this end?\\\" Your voice shakes — not acting this time. \\\"Lift martial law or armed suppression. No middle ground.\\\" For the first time, \\\"civilians\\\" becomes a concrete word. People could die. Because of what you signed."}',
 '{}', NULL, 15, '{"sobriety":3,"guilt":2}', 'pragmatic'),

-- ━━━ Choke Point: 술병과 서류 ━━━
('pres_choke1', 'dlc_president', 1, 'story',
 '{"ko":"새벽 4시.\n\n책상 위에 빈 와인병 3개.\n장태호가 두고 간 서류.\n\n머리가 아프다.\n서류의 글자가 흐릿하다.\n\n하지만 — 무언가가 이상하다.\n이 서류... 읽어야 하는 거 아닌가?\n\n손을 뻗는다.\n\n...한 페이지를 넘긴다.","en":"4 AM. Three empty bottles. Jang''s documents on the desk. Head pounding. Letters blurry. But something is wrong. Shouldn''t you read this? Your hand reaches out."}',
 '{}', '{"min_stats":{"sobriety":3}}', 0, NULL, NULL),

-- Choke 실패: 와인 대통령 엔딩 (P-E4)
('pres_ending_wine', 'dlc_president', 1, 'ending',
 '{"ko":"와인이 이긴다.\n\n눈이 감긴다.\n서류 위에 고개를 떨군다.\n빈 와인병 사이에서 대통령이 잠든다.\n\n...\n\n아침 햇살.\n이수연이 서재 문을 연다.\n\n\"여보, 푹 잤어?\n계엄은 해제됐어. 내가 알아서 했어.\"\n\n\"...고마워.\"\n\n이 한마디에 28년 결혼이 요약된다.\n처음부터 끝까지 아무것도 하지 않은 대통령.\n\n━━━━━━━━━━━━━━━━━━━━━━━\n\n[와인 대통령]\n\n대한민국 — 아니, Veridian 공화국 역사상\n가장 아무것도 하지 않은 대통령.\n\n계엄을 선포했지만, 내용을 몰랐다.\n계엄이 해제됐지만, 자기가 한 게 아니다.\n\n법정에서:\n\"저는... 잠들어 있었습니다.\"\n\n변호사도 검사도 판사도 — 말문이 막힌다.\n\n딸 이하은이 면회를 온다.\n\"아빠... 그날 밤 뭐 했어?\"\n\"...잤어.\"\n\n하은이 돌아선다.\n문이 닫힌다.","en":"Wine wins. You fall asleep on the documents. Morning — Suyeon opens the door. \\\"Honey, slept well? I lifted martial law. I handled it.\\\" \\\"...Thanks.\\\" 28 years of marriage in one word. In court: \\\"I was... asleep.\\\" The lawyers are speechless. Your daughter visits. \\\"Dad, what did you do that night?\\\" \\\"...Slept.\\\""}',
 '{"title":{"ko":"와인 대통령","en":"The Wine President"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ═══════════════════════════════════════════
-- PRESIDENT ACT 1 선택지 (choices)
-- ═══════════════════════════════════════════

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- 프롤로그 → 오프닝
('dlc_president', 'pres_prologue', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_opening', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 오프닝 → BP1
('dlc_president', 'pres_opening', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP1: 장태호의 보고 (4지선다)
('dlc_president', 'pres_bp1', 0,
 '{"ko":"✍️ 읽지 않고 서명","en":"Sign without reading"}',
 '{"ko":"핵심만 잡으면 돼. 세부 사항은 자네가 알아서 해.","en":"Just get the gist. Details are your job."}',
 'pres_bp1_result_a', 15, '{"delusion":3}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp1', 1,
 '{"ko":"📞 수연이한테 물어봐","en":"Ask Suyeon about this"}',
 '{"ko":"수연이가 알아서 해.","en":"Suyeon will handle it."}',
 'pres_bp1_result_b', 10, '{"delusion":1,"guilt":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp1', 2,
 '{"ko":"🍷 나중에 볼게","en":"I''ll look at it later"}',
 '{"ko":"와인 한 잔 더.","en":"Another glass of wine."}',
 'pres_bp1_result_c', 10, '{"sobriety":-2}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp1', 3,
 '{"ko":"📖 서류를 읽어본다","en":"Try to read the document"}',
 '{"ko":"이게 뭔 소리야...","en":"What does this even mean..."}',
 'pres_bp1_result_d', 20, '{"delusion":-1,"sobriety":2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP1 결과 → ME (경호원의 경례)
('dlc_president', 'pres_bp1_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_salute', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp1_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_salute', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp1_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_salute', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp1_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_salute', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- ME → BP2 (딸의 SNS)
('dlc_president', 'pres_me_salute', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP2: 딸의 SNS (4지선다)
('dlc_president', 'pres_bp2', 0,
 '{"ko":"📱 아빠가 다 알아서 해","en":"Daddy will handle it"}',
 '{"ko":"메시지를 보낸다","en":"Send a message"}',
 'pres_bp2_result_a', 10, '{"delusion":2}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp2', 1,
 '{"ko":"😤 내 딸이 나를 부정해?","en":"My daughter denies me?"}',
 '{"ko":"분노가 치민다","en":"Rage rises"}',
 'pres_bp2_result_b', 10, '{"delusion":3,"guilt":-1}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp2', 2,
 '{"ko":"📵 SNS 닫고 와인","en":"Close SNS, pour wine"}',
 '{"ko":"보지 않으면 없는 거야","en":"If you don''t look, it doesn''t exist"}',
 'pres_bp2_result_c', 10, '{"sobriety":-2}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp2', 3,
 '{"ko":"😔 댓글을 하나씩 읽는다","en":"Read every comment"}',
 '{"ko":"손이 멈춘다","en":"Your hand stops"}',
 'pres_bp2_result_d', 15, '{"delusion":-2,"guilt":2,"sobriety":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP2 결과 → BP3 (강무현 보고)
('dlc_president', 'pres_bp2_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp2_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp2_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp2_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP3: 강무현 야간 보고 (4지선다)
('dlc_president', 'pres_bp3', 0,
 '{"ko":"💪 10만? 대수야?","en":"100,000? So what?"}',
 '{"ko":"내가 결정한 거야","en":"I made the call"}',
 'pres_bp3_result_a', 10, '{"delusion":3}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp3', 1,
 '{"ko":"📞 수연이한테 물어봐","en":"Ask Suyeon"}',
 '{"ko":"수연이가 아니까","en":"Suyeon knows"}',
 'pres_bp3_result_b', 5, '{"delusion":1}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp3', 2,
 '{"ko":"🤔 이게 성공할 수 있어?","en":"Can this succeed?"}',
 '{"ko":"처음으로 질문한다","en":"The first real question"}',
 'pres_bp3_result_c', 10, '{"sobriety":2,"delusion":-1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp3', 3,
 '{"ko":"🍷 잔을 내려놓고... 이거 어떻게 끝나?","en":"Put the glass down... how does this end?"}',
 '{"ko":"목소리가 떨린다","en":"Your voice shakes"}',
 'pres_bp3_result_d', 15, '{"sobriety":3,"guilt":2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP3 결과 → Choke Point (sobriety ≥ 3으로 분기)
('dlc_president', 'pres_bp3_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp3_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp3_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp3_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Choke1: sobriety < 3 → 와인 대통령 엔딩
('dlc_president', 'pres_choke1', 0, '{"ko":"서류를 읽는다...","en":"Read the documents..."}', '{"ko":"한 페이지를 넘긴다","en":"Turn a page"}', 'pres_act2_bridge', 0, NULL, '{"min_stats":{"sobriety":3}}', NULL, NULL, FALSE, 0, TRUE, 'sobriety', 3, 'pres_ending_wine'),

-- 와인 엔딩은 터미널 (선택지 없음)

-- Act 2 브릿지 노드 (Act 2 파일에서 이어짐)
('dlc_president', 'pres_act2_bridge', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_act2_opening', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT (scenario_id, node_id, choice_index) DO NOTHING;


-- ====== 20260222_seed_president_act2.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — PRESIDENT DLC ACT 2 시나리오 데이터 시드
-- 균열 (04:00~02:00): "니가 뭔데?"
-- 시점: 이재민 (Veridian 공화국 대통령)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ━━━ Act 2 오프닝: 서류를 읽다 ━━━
('pres_act2_opening', 'dlc_president', 2, 'story',
 '{"ko":"━━━ 04:00 — 균열 ━━━\n\n처음으로 Directive 6 전문을 읽는다.\n\n1조: 계엄 선포\n2조: 집회결사 금지\n3조: 시민 저항 시 최소 필요 무력 사용\n4조: 언론 통제\n5조: 국회 기능 정지\n\n...국회 기능 정지?\n이게 뭔 소리야?\n\n\"내가... 국회를 닫은 거야?\"\n\n아무도 대답하지 않는다.\n집무실에 혼자다.\n\n처음으로 — 자기가 뭘 서명했는지 안다.\n하지만 안다고 책임지는 건 별개다.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"You read Directive 6 for the first time. Article 5: Suspension of National Assembly functions. \\\"I... shut down congress?\\\" No one answers. For the first time — you know what you signed. But knowing and taking responsibility are different things."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 분기점 P-BP4: 이수연과의 대립 ━━━
('pres_bp4', 'dlc_president', 2, 'branch_main',
 '{"ko":"이수연이 서재에 온다.\n\n와인잔 옆에 펼쳐진 Directive 6 전문.\n이수연의 눈이 좁아진다.\n\n\"...이걸 왜 읽고 있어?\"\n\"당신은 내일 연설문이나 준비하면 되는데.\"\n\n이수연은 서류를 접으려 한다.\n\n처음으로 — 서류를 놓지 않는다.\n아니, 놓지 않으려고 한다.\n손에 힘이 들어간다.","en":"Suyeon enters. Directive 6 spread on the desk. Her eyes narrow. \\\"Why are you reading this?\\\" She reaches for the document. For the first time — you don''t let go. Or try not to."}',
 '{}', NULL, 5, NULL, NULL),

-- P-BP4 결과 노드들
('pres_bp4_result_a', 'dlc_president', 2, 'story',
 '{"ko":"서류를 덮는다.\n\n\"...잠이 안 와서. 그냥 봤어.\"\n\n이수연이 미소 짓는다.\n\"여보, 그런 건 내가 볼게. 자.\"\n\n서류를 가져간다.\n\n문이 닫힌다.\n\n다시 혼자.\n다시 와인.\n다시 아무것도 하지 않는 대통령.\n\n[퇴행 — 서류를 읽었지만 아무것도 바뀌지 않는다]","en":"You cover the document. \\\"Couldn''t sleep.\\\" Suyeon smiles, takes it. The door closes. Alone again. Wine again. Nothing changes."}',
 '{}', NULL, 10, '{"delusion":1}', NULL),

('pres_bp4_result_b', 'dlc_president', 2, 'story',
 '{"ko":"\"이 3조... 최소 필요 무력 사용이 뭔 뜻이야?\"\n\n이수연이 멈춘다.\n\n\"...당신이 그걸 왜 궁금해해?\"\n\"내가 서명했으니까.\"\n\n처음으로 이수연의 표정에 당혹감이 스친다.\n이 남자가 — 질문을 했다.\n28년 만에 처음으로.\n\n\"...시민이 저항하면 군이 대응한다는 뜻이야.\"\n\"대응이 뭔데? 총 쏘는 거야?\"\n\n이수연이 잠시 침묵한다.\n\"...필요하면.\"\n\n이재민의 손이 떨린다.\n\n[모름 인정 — 처음으로 자기 서명의 무게를 질문]","en":"\\\"What does Article 3 mean? Minimum necessary force?\\\" Suyeon stops. For the first time in 28 years, this man asked a question. \\\"If civilians resist, the military responds.\\\" \\\"Responds how? Shooting?\\\" Silence. \\\"...If necessary.\\\" Your hand trembles."}',
 '{}', NULL, 15, '{"sobriety":2,"delusion":-2}', 'pragmatic'),

('pres_bp4_result_c', 'dlc_president', 2, 'story',
 '{"ko":"\"이거 왜 나한테 안 보여줬어!\"\n\n분노가 터진다.\n\n\"5조! 국회 기능 정지!\n이런 게 들어있는 걸 왜 나한테 안 알려줬어!\"\n\n이수연이 차갑게 말한다.\n\"내가 보여줬어. 당신이 안 읽은 거야.\"\n\n\"...그래도! 설명을 해줬어야지!\"\n\n남 탓.\n읽지 않은 건 자기.\n서명한 건 자기.\n하지만 책임은 — 언제나 남의 것.\n\n이수연이 돌아선다.\n\"앞으로도 안 읽을 거잖아.\"\n\n[법꾸라지 발동 — 읽지 않은 책임을 남에게 전가]","en":"\\\"Why didn''t you show me this! Article 5!\\\" Suyeon: \\\"I showed you. You didn''t read.\\\" \\\"You should have EXPLAINED!\\\" You didn''t read. You signed. But the blame — always someone else''s."}',
 '{}', NULL, 10, '{"delusion":2}', 'cold_blood'),

('pres_bp4_result_d', 'dlc_president', 2, 'story',
 '{"ko":"\"내가 대통령인데!\"\n\n갑자기 일어선다.\nDirective 6를 손에 쥔다.\n\n\"내가! 이걸 서명했어! 내가 대통령이야!\n당신이 뭔데 이걸 가져가?\"\n\n이수연이 차갑게 웃는다.\n\n\"당신이 대통령이면\n내가 뭔지는 당신이 제일 잘 알잖아.\"\n\n정적.\n\n서류를 내려놓는다.\n\n...맞다. 수연이가 없으면 나는...\n\n[나르시시즘 폭발 후 즉각 붕괴 — 자기가 대통령인 이유가 수연이라는 자각]","en":"\\\"I''M the president!\\\" You grab Directive 6. Suyeon smiles coldly: \\\"If you''re president, you know exactly what I am.\\\" Silence. You put the paper down. ...Right. Without Suyeon, I''m..."}',
 '{}', NULL, 10, '{"delusion":3}', 'cold_blood'),

-- ━━━ 미니 이벤트: 화장실 거울 ━━━
('pres_me_mirror', 'dlc_president', 2, 'story',
 '{"ko":"화장실에 들어간다.\n\n거울.\n\n54세. 붉은 눈. 와인 얼룩이 묻은 셔츠.\n넥타이는 풀려 있다.\n\n몇 시간 전까지 \"강한 지도자\"라고 생각했던 남자.\n\n\"...니가 뭔데?\"\n\n자기에게 한 말인지,\n이수연에게 한 말인지,\n본인도 모른다.\n\n물을 틀어 세수한다.\n찬물이 얼굴에 닿는다.\n\n잠깐 — 아주 잠깐 — 깨어 있다.\n\n하지만 깨어 있는 것도 잠깐이다.","en":"Bathroom mirror. 54, red eyes, wine-stained shirt. Hours ago you thought you were a strong leader. \\\"...Who the hell are you?\\\" Said to yourself — or to Suyeon. You don''t know. Cold water. For a moment — just a moment — you''re awake."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 분기점 P-BP5: 한세진의 연락 ━━━
('pres_bp5', 'dlc_president', 2, 'branch_main',
 '{"ko":"폰이 울린다.\n\n한세진 의장.\n\n\"대통령님, 한세진입니다.\n지금 해제하시면 당신도 살 수 있습니다.\n헌법 77조 4항에 의거하여\n국회가 계엄 해제를 요구할 경우...\"\n\n법률 용어가 쏟아진다.\n이해하지 못한다.\n\n법을 공부했지만 — 부하가 다 해줬으니까.\n77조가 뭔지, 4항이 뭔지,\n하나도 기억나지 않는다.","en":"Speaker Han Sejin calls. \\\"Mr. President, if you lift it now, you can survive. Constitutional Article 77, Paragraph 4...\\\" Legal jargon pours out. You don''t understand. You studied law — but your staff did everything."}',
 '{}', NULL, 5, NULL, NULL),

-- P-BP5 결과 노드들
('pres_bp5_result_a', 'dlc_president', 2, 'story',
 '{"ko":"\"나한테 그런 거 말하지 마.\"\n\n전화를 끊는다.\n\n법률 용어를 이해하지 못하는 수치심.\n하지만 그 수치심을 분노로 전환한다.\n\n\"내가 대통령인데 의장이 감히?\n국회를 정지시킨 건 나야.\n니가 뭔데 나한테 법을 가르쳐?\"\n\n모르는 게 수치스러운 게 아니라,\n모른다는 걸 들킨 것이 분한 거다.\n\n[나르시시즘적 방어 — 무지를 분노로 전환]","en":"You hang up. The shame of not understanding turns to anger. \\\"I''m the president. Who is he to lecture me about law?\\\" It''s not the ignorance that stings — it''s being caught."}',
 '{}', NULL, 5, '{"delusion":2}', 'cold_blood'),

('pres_bp5_result_b', 'dlc_president', 2, 'story',
 '{"ko":"\"...그게 무슨 법조항이야?\"\n\n처음으로 — 솔직하게 물었다.\n\n한세진이 잠시 멈춘다.\n대통령이 77조를 모른다.\n\n\"...헌법 77조는 계엄에 관한 조항입니다.\n4항은 국회 과반수가 해제를 요구하면\n대통령이 해제해야 한다는 내용입니다.\"\n\n\"과반수가 요구하면... 나는 해야 해?\"\n\"네. 의무입니다.\"\n\n\"...난 그런 것도 모르고 서명했어.\"\n\n한세진이 한숨을 쉰다.\n\"...알고 있습니다, 대통령님.\"\n\n[무지의 고백 — 처음으로 \"모른다\"고 인정]","en":"\\\"What does that article mean?\\\" You ask honestly. Han pauses — the president doesn''t know Article 77. He explains. \\\"I signed without knowing any of this.\\\" Han sighs. \\\"...I know, Mr. President.\\\""}',
 '{}', NULL, 15, '{"sobriety":3,"delusion":-3}', 'pragmatic'),

('pres_bp5_result_c', 'dlc_president', 2, 'story',
 '{"ko":"\"내가 알아서 할 거야!\"\n\n큰소리로 말한다.\n\n\"한 의장, 이건 내 관할이야.\n내가 판단하고 내가 결정해.\n간섭하지 마.\"\n\n전화를 끊는다.\n\n그리고 — 아무것도 하지 않는다.\n\n\"알아서 한다\"고 말했지만,\n뭘 해야 하는지 모른다.\n\n30분이 지난다.\n1시간이 지난다.\n아무것도 하지 않는다.\n\n[\"알아서 해\" → 아무것도 안 함. 이재민의 인생 요약]","en":"\\\"I''ll handle it myself!\\\" You shout. Hang up. Then — nothing. You said you''d handle it, but you don''t know what to do. 30 minutes pass. An hour. Nothing. \\\"I''ll handle it\\\" → nothing. The story of Lee Jaemin''s life."}',
 '{}', NULL, 10, '{"delusion":2,"guilt":2}', NULL),

('pres_bp5_result_d', 'dlc_president', 2, 'story',
 '{"ko":"\"한 지도자...\"\n\n목소리가 갈라진다.\n\n\"나는... 아무것도 아니었어.\"\n\n전화기 너머로 한세진이 침묵한다.\n\n\"부하들이 다 해줬어. 나는 자리만 차지했고.\n아내가 정치를 시켰어. 나는 따라갔을 뿐이고.\"\n\n\"대통령님...\"\n\n\"이 서류도 — 모르고 서명했어.\n내가 뭘 한 건지도 모르겠어.\n나는...\"\n\n하지만 여기서 멈춘다.\n\n\"...조금만 시간을 줘.\"\n\n전화를 끊는다.\n손이 떨린다.\n\n[처음으로 — 허울이 벗겨지기 시작]","en":"\\\"Speaker Han... I was never really anything.\\\" Silence. \\\"My staff did everything. My wife pushed me into politics. I signed this without understanding.\\\" You stop. \\\"Give me a little time.\\\" The facade begins to crack."}',
 '{}', NULL, 15, '{"sobriety":5}', 'pragmatic'),

-- ━━━ Choke Point: 이수연의 와인 ━━━
('pres_choke2', 'dlc_president', 2, 'story',
 '{"ko":"이수연이 와인을 가져온다.\n\n\"여보, 너무 힘들지? 이거 마시고 쉬어.\"\n\n달콤한 아로마. 익숙한 와인.\n하지만 — 뭔가 이상하다.\n이수연의 미소가 너무 부드럽다.\n\n이 와인에는 수면제가 들어 있다.\n마시면 아침까지 잔다.\n그리고 이수연이 모든 것을 처리한다.\n\n또.\n\n항상 그래왔던 것처럼.","en":"Suyeon brings wine. \\\"You look tired. Drink this and rest.\\\" The familiar aroma. But her smile is too gentle. There''s something in the wine. If you drink, you sleep till morning. And Suyeon handles everything. Again. Like always."}',
 '{}', '{"min_stats":{"sobriety":7}}', 0, NULL, NULL),

-- Choke 실패: 꼭두각시 루프 엔딩 (P-E5)
('pres_ending_puppet', 'dlc_president', 2, 'ending',
 '{"ko":"와인을 마신다.\n달콤하다.\n눈이 감긴다.\n\n...\n\n깨어나면 모든 것이 끝나 있다.\n\n━━━━━━━━━━━━━━━━━━━━━━━\n\n[꼭두각시의 루프]\n\n법정.\n\n\"저는 — 아내가 시켰습니다.\"\n\"구체적으로 뭘 시켰습니까?\"\n\"...다요.\"\n\n20년형.\n방콕 콘도로 추방.\n이수연은 별장에서 와인을 마신다.\n\n3개월 후.\n이수연의 전화.\n\"여보, 빨래 좀 넣어.\"\n\"...알겠어.\"\n\n꼭두각시의 영원한 루프.\n결혼 앞에서도.\n법정 앞에서도.\n콘도 앞에서도.\n\n달라진 건 아무것도 없다.","en":"You drink. Sweet. Eyes close. When you wake, everything is over. In court: \\\"My wife told me to.\\\" \\\"What specifically?\\\" \\\"...Everything.\\\" Bangkok condo. Three months later: \\\"Honey, do the laundry.\\\" \\\"...Okay.\\\" The puppet''s eternal loop."}',
 '{"title":{"ko":"꼭두각시의 루프","en":"The Puppet''s Loop"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ═══════════════════════════════════════════
-- PRESIDENT ACT 2 선택지 (choices)
-- ═══════════════════════════════════════════

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Act 2 오프닝 → BP4
('dlc_president', 'pres_act2_opening', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp4', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP4: 이수연과의 대립 (4지선다)
('dlc_president', 'pres_bp4', 0,
 '{"ko":"서류를 덮는다","en":"Cover the document"}',
 '{"ko":"잠이 안 와서... 그냥 봤어","en":"Couldn''t sleep... just browsing"}',
 'pres_bp4_result_a', 10, '{"delusion":1}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp4', 1,
 '{"ko":"이 3조 무슨 뜻이야?","en":"What does Article 3 mean?"}',
 '{"ko":"모른다고 인정한다","en":"Admit you don''t know"}',
 'pres_bp4_result_b', 15, '{"sobriety":2,"delusion":-2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp4', 2,
 '{"ko":"왜 나한테 안 보여줬어!","en":"Why didn''t you show me!"}',
 '{"ko":"남 탓을 시작한다","en":"Start blaming others"}',
 'pres_bp4_result_c', 10, '{"delusion":2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp4', 3,
 '{"ko":"내가 대통령인데!","en":"I''M the president!"}',
 '{"ko":"나르시시즘 폭발","en":"Narcissistic explosion"}',
 'pres_bp4_result_d', 10, '{"delusion":3}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP4 결과 → ME (화장실 거울)
('dlc_president', 'pres_bp4_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_mirror', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp4_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_mirror', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp4_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_mirror', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp4_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_me_mirror', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- ME → BP5 (한세진의 연락)
('dlc_president', 'pres_me_mirror', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP5: 한세진의 연락 (4지선다)
('dlc_president', 'pres_bp5', 0,
 '{"ko":"나한테 그런 거 말하지 마","en":"Don''t talk to me about that"}',
 '{"ko":"전화를 끊는다","en":"Hang up"}',
 'pres_bp5_result_a', 5, '{"delusion":2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp5', 1,
 '{"ko":"그게 무슨 법조항이야?","en":"What does that article mean?"}',
 '{"ko":"모르겠다고 솔직히 묻는다","en":"Honestly ask what you don''t know"}',
 'pres_bp5_result_b', 15, '{"sobriety":3,"delusion":-3}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp5', 2,
 '{"ko":"내가 알아서 할 거야!","en":"I''ll handle it myself!"}',
 '{"ko":"큰소리 → 아무것도 안 함","en":"Shout → do nothing"}',
 'pres_bp5_result_c', 10, '{"delusion":2,"guilt":2}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp5', 3,
 '{"ko":"나는... 아무것도 아니었어","en":"I was never really anything"}',
 '{"ko":"허울이 벗겨지기 시작한다","en":"The facade begins to crack"}',
 'pres_bp5_result_d', 15, '{"sobriety":5}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP5 결과 → Choke2 (이수연의 와인)
('dlc_president', 'pres_bp5_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp5_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp5_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_president', 'pres_bp5_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Choke2: sobriety < 7 → 꼭두각시 엔딩
('dlc_president', 'pres_choke2', 0, '{"ko":"오늘은 안 마실게","en":"Not tonight"}', '{"ko":"와인잔을 밀어낸다","en":"Push the glass away"}', 'pres_act3_bridge', 0, NULL, '{"min_stats":{"sobriety":7}}', NULL, NULL, FALSE, 0, TRUE, 'sobriety', 7, 'pres_ending_puppet'),

-- Act 3 브릿지
('dlc_president', 'pres_act3_bridge', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_act3_opening', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT (scenario_id, node_id, choice_index) DO NOTHING;


-- ====== 20260222_seed_president_act3.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — PRESIDENT DLC ACT 3 시나리오 데이터 시드
-- 직면? (02:00~00:00): "서명도 남이 시킨 건데"
-- 시점: 이재민 (Veridian 공화국 대통령)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ━━━ Act 3 오프닝: 혼자 ━━━
('pres_act3_opening', 'dlc_president', 3, 'story',
 '{"ko":"━━━ 02:00 — 직면? ━━━\n\n이수연의 와인을 거부했다.\n\n\"오늘은 안 마실게.\"\n\n이수연의 눈에 처음으로 당혹이 스친다.\n이 남자가 — 와인을 거부했다.\n28년 만에 처음.\n\n\"...알았어. 쉬어.\"\n\n이수연이 나간다.\n서재에 가방을 챙기는 소리.\n도주 준비.\n\n이재민은 혼자다.\n28년 만에 처음으로, 진짜 혼자.\n\n하지만 혼자였던 적이 없는 남자에게\n\"혼자\"는 공포다.\n\n새벽 5시.\n책상 위에 계엄 해제 문서.\n펜.\n\n왼쪽에는 서재로 이어지는 문 — 이수연이 도주 준비 중.\n오른쪽에는 카메라 — 꺼져 있지만 켤 수 있다.\n정면에는 화장실 거울.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"You refused the wine. For the first time in 28 years. Suyeon''s eyes flicker with surprise. She leaves — packing sounds from the study. You''re alone. Truly alone for the first time. And for a man who has never been alone, solitude is terror. Dawn. The martial law revocation document on the desk. A pen. The study door — Suyeon preparing to flee. The camera — off, but ready. The bathroom mirror."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ 분기점 P-BP7: 최후의 순간 ━━━
('pres_bp7', 'dlc_president', 3, 'branch_main',
 '{"ko":"새벽 5시.\n\n계엄 해제 문서. 펜.\n이수연은 서재에서 여권을 챙기고 있다.\n\n혼자 앉아 있다.\n\n생각한다.\n\n...내가 뭘 할 수 있지?\n\n뭘 해도 안 됐을 때도\n누군가가 \"괜찮아, 다시 해봐\"라고 했다.\n일할 때도\n부하가 \"제가 하겠습니다\"라고 했다.\n정치에서도\n이수연이 \"내가 다 할게\"라고 했다.\n\n지금은 — 아무도 없다.\n\n뭘 해야 하지?","en":"5 AM. The revocation document. Suyeon is packing passports. You sit alone. When nothing worked — someone said try again. At work — staff handled it. In politics — Suyeon managed everything. Now — no one. What do you do?"}',
 '{}', NULL, 5, NULL, NULL),

-- BP7 결과 노드들
('pres_bp7_result_a', 'dlc_president', 3, 'story',
 '{"ko":"펜을 든다.\n\n계엄 해제 문서.\n\n\"이것만은... 내가.\"\n\n서명한다.\n\n손이 떨리지만 — 이번엔 스스로 읽었다.\n뭘 서명하는지 안다.\n적어도 그렇다고 생각한다.\n\n장태호에게 전화한다.\n\"계엄 해제합니다.\"\n\"...알겠습니다, 대통령님.\"\n\n전화를 끊는다.\n\n했다.\n내가 했다.\n\n...근데 왜 한 거지?\n\n모른다.\n\n[계엄 해제 서명 — 올바른 행동. 하지만 이유를 모른다.]","en":"You pick up the pen. \\\"This one... is mine.\\\" You sign. Your hand trembles but you read it this time. You know what you''re signing. You think. You call Jang. \\\"Lift martial law.\\\" Done. I did it. ...But why? You don''t know."}',
 '{}', NULL, 10, '{"sobriety":3,"guilt":-2}', 'pragmatic'),

('pres_bp7_result_b', 'dlc_president', 3, 'story',
 '{"ko":"일어선다.\n서재로 간다.\n\n\"수연아.\"\n\n이수연이 여권을 챙기다 멈춘다.\n\n\"...나도 데려가.\"\n\n이수연이 잠시 쳐다본다.\n\n\"...알았어. 빨리 챙겨.\"\n\n28년간 이수연이 깔아준 길.\n그 길의 끝이 — 도주다.\n\n\"여보, 여권 어디 있어?\"\n\"서랍 왼쪽.\"\n\n지시를 따른다.\n항상 그래왔던 것처럼.\n\n[이수연 따라 도주 — 끝까지 따라가는 남자]","en":"You go to the study. \\\"Suyeon. Take me too.\\\" She pauses. \\\"...Fine. Pack fast.\\\" 28 years of paths Suyeon built. The path ends in escape. Following instructions. Like always."}',
 '{}', NULL, 10, '{"delusion":3,"guilt":5}', 'cold_blood'),

('pres_bp7_result_c', 'dlc_president', 3, 'story',
 '{"ko":"카메라를 켠다.\n\n빨간 불이 들어온다.\n녹화 중.\n\n넥타이를 고쳐맨다.\n기침을 한다.\n\n\"국민 여러분.\"\n\n잠시 멈춘다.\n\n\"저는... 저는...\"\n\n대통령으로서의 위엄을 보이고 싶다.\n역사에 남을 연설을 하고 싶다.\n강한 지도자의 마지막 말을 남기고 싶다.\n\n하지만 — 할 말이 없다.\n\n\"저는... 저는...\"\n\n눈물이 난다.\n왜 우는지도 모른다.\n\n[카메라 앞 연설 — 웅장하지만 내용 없음]","en":"You turn on the camera. Red light. \\\"My fellow citizens.\\\" Pause. \\\"I... I...\\\" You want dignity. A historic speech. A strong leader''s last words. But there''s nothing to say. \\\"I... I...\\\" Tears. You don''t know why you''re crying."}',
 '{}', NULL, 10, '{"delusion":5}', NULL),

('pres_bp7_result_d', 'dlc_president', 3, 'story',
 '{"ko":"화장실로 간다.\n\n거울 앞에 선다.\n\n54세. 붉은 눈. 풀린 넥타이.\n와인 얼룩. 주름.\n\n\"나는...\"\n\n말을 잇지 못한다.\n\n\"나는 —\"\n\n거울 속의 남자가 쳐다본다.\n지도자도 아니었던 남자.\n대통령도 아닌 남자.\n이수연의 남편이라는 것 외에\n아무것도 아닌 남자.\n\n\"...\"\n\n한참을 서 있다.\n\n그리고 — 돌아선다.\n\n[거울 앞 직면 시도 — 말을 잇지 못하지만, 돌아서서 무언가를 한다]","en":"Bathroom mirror. 54. Red eyes. Loose tie. Wine stains. \\\"I am—\\\" You can''t finish. The man in the mirror stares back. Never a leader. Not really a president. Nothing, except Suyeon''s husband. You stand there. Then — you turn around. You don''t know what you''ll do. But you turn around."}',
 '{}', NULL, 10, '{"sobriety":5}', 'pragmatic'),

-- ═══════════════════════════════════════════
-- 엔딩 노드 (4개 — E1 Best, E2 Neutral Good, E3 Neutral Bad, E6 Hidden)
-- E4 와인 대통령, E5 꼭두각시는 Act 1/2에서 처리됨
-- ═══════════════════════════════════════════

-- P-E1: 서명 한 장 (Best)
('pres_ending_best', 'dlc_president', 3, 'ending',
 '{"ko":"━━━━━━━━━━━━━━━━━━━━━━━\n\n[서명 한 장]\n\n계엄이 해제됐다.\n이재민이 서명했다.\n\n100만 명의 밤이 끝났다.\n\n하지만 —\n\n법정.\n\n변호사: \"왜 해제하셨습니까?\"\n이재민: \"...그게...\"\n변호사: \"대통령으로서의 판단이었습니까?\"\n이재민: \"...\"\n\n올바른 행동을 했다.\n하지만 왜 한 건지 설명을 못 한다.\n\n판사: \"피고인은 계엄 선포 및 해제에 대한\n명확한 인식이 없었던 것으로 보입니다.\"\n\n15년형. 감형 5년.\n\n딸 이하은이 면회를 온다.\n\n\"아빠... 왜 그랬어?\"\n\"...아빠도 몰라.\"\n\n\"왜 해제했어?\"\n\"그것도... 몰라.\"\n\n이하은이 울면서 나간다.\n\n최선의 엔딩이다.\n하지만 반성이 아니라 —\n우연히 맞은 것일 수 있다.\n\n그래도.\n서명 한 장이 100만 명을 구했다.\n\n그것만으로 충분한가?\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Martial law lifted. You signed. One million people''s night ends. In court: \\\"Why did you lift it?\\\" \\\"I... don''t know.\\\" The right action. No reason. 15 years, reduced to 10. Your daughter visits. \\\"Dad, why?\\\" \\\"I don''t know.\\\" The best ending. Perhaps not reflection — perhaps just luck. But one signature saved a million lives. Is that enough?"}',
 '{"title":{"ko":"서명 한 장","en":"One Signature"},"grade":"true_good"}', '{"min_stats":{"sobriety":10}}', 0, NULL, NULL),

-- P-E2: 마지막 연설 (Neutral Good)
('pres_ending_speech', 'dlc_president', 3, 'ending',
 '{"ko":"━━━━━━━━━━━━━━━━━━━━━━━\n\n[마지막 연설]\n\n카메라 앞.\n빨간 불.\n\n\"국민 여러분, 저는... 저는...\"\n\n말을 잇지 못한다.\n\n눈물이 흐른다.\n왜 우는지 모른다.\n\n\"저는...\"\n\n30초의 침묵.\n\n전국에 생중계된다.\n\n댓글:\n\"저 사람, 울고 있어...\"\n\"처음으로 진심인 것 같아.\"\n\"대통령이 울어야 할 때 울었다.\"\n\n하지만 그는 울고 싶어서 운 게 아니다.\n할 말이 없어서 운 거다.\n\n말만 잘했던 남자가 말을 잃은 순간,\n아이러니하게도 \"진짜 대통령\"으로 기억된다.\n\n계엄은 의회가 해제한다.\n이재민은 아무것도 하지 않았지만,\n국민은 \"그 눈물\"을 기억한다.\n\n법정.\n\"저는 서명만 했을 뿐입니다.\"\n\n눈물은 진심이었을까?\n아무도 모른다.\n이재민 자신도.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Camera. Red light. \\\"My fellow citizens, I... I...\\\" Silence. Tears. 30 seconds of nothing, broadcast nationally. \\\"He''s actually crying...\\\" \\\"For the first time, it feels real.\\\" But you''re not crying because you feel. You''re crying because you have nothing to say. A man of words, wordless — and ironically remembered as a \\\"real president.\\\" In court: \\\"I just signed.\\\" Were the tears real? No one knows."}',
 '{"title":{"ko":"마지막 연설","en":"The Last Address"},"grade":"good"}', '{"min_stats":{"delusion":8,"sobriety":5}}', 0, NULL, NULL),

-- P-E3: 법꾸라지 (Neutral Bad)
('pres_ending_eel', 'dlc_president', 3, 'ending',
 '{"ko":"━━━━━━━━━━━━━━━━━━━━━━━\n\n[법꾸라지]\n\n계엄은 어떻게든 끝났다.\n이수연이 처리했든, 의회가 처리했든.\n이재민은 — 아무것도 하지 않았다.\n\n법정.\n\n검사: \"피고인은 왜 Directive 6에 서명했습니까?\"\n\n\"강무현 국장이 상황을 보고했고,\n저는 판단을 위임...\"\n\n검사: \"위임? 대통령이 계엄을 위임합니까?\"\n\n\"아내가... 제 판단에 영향을...\"\n\n방청석에서 이수연이 웃는다.\n\n검사: \"본인의 의사로 서명한 것이 맞습니까?\"\n\n\"저도 피해자입니다.\n조종당한 피해자요.\"\n\n판사가 고개를 젓는다.\n검사가 한숨을 쉰다.\n변호사도 포기한 표정.\n\n20년형.\n감형 없음.\n\n감옥에서.\n\"내가 뭘 잘못했는데?\"\n\n면회 오는 사람 없음.\n이수연은 해외.\n이하은은 성을 바꿨다.\n\n끝까지 — 자기가 억울하다고 생각한다.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Martial law ends — someone else did it. In court: \\\"Director Kang reported, I delegated judgment.\\\" \\\"My wife influenced my decision.\\\" Suyeon laughs from the gallery. \\\"I''m a victim too.\\\" 20 years. No reduction. In prison: \\\"What did I do wrong?\\\" No visitors. Suyeon overseas. Haeun changed her name. To the end — he believes he was wronged."}',
 '{"title":{"ko":"법꾸라지","en":"The Legal Eel"},"grade":"bad"}', '{"min_stats":{"delusion":10},"max_stats":{"guilt":4}}', 0, NULL, NULL),

-- P-E6: 찌질한 자백 (Hidden)
('pres_ending_hidden', 'dlc_president', 3, 'ending',
 '{"ko":"━━━━━━━━━━━━━━━━━━━━━━━\n\n[찌질한 자백]\n\n카메라를 켠다.\n연설을 하지 않는다.\n\n그냥 — 말한다.\n\n\"저는... 한 번도 스스로 해본 적이 없습니다.\"\n\n\"어디에서든 부하들이 일을 했고,\n저는 말만 했습니다.\"\n\n\"씀씀이가 크니까 사람들이 따랐고,\n그걸 능력이라고 착각했습니다.\"\n\n\"아내가 정치 경로를 짰고,\n저는 따라갔을 뿐입니다.\"\n\n\"대통령이 되고 나서도\n서류를 이해하지 못했습니다.\n오늘 밤에야 — 처음으로 읽었습니다.\"\n\n\"계엄을 선포한 이유요?\n한 번이라도...\n''강한 대통령''으로 불리고 싶었습니다.\"\n\n\"...그게 전부입니다.\"\n\n\"저는 서명만 했을 뿐입니다.\"\n\n잠시 멈춘다.\n\n\"아, 이것도 발뺌이군요.\"\n\n카메라가 꺼진다.\n\n━━━━━━━━━━━━━━━━━━━━━━━\n\n인류 역사상 가장 찌질한 자백.\n\n국민은 경악한다.\n\"대통령이... 서류를 안 읽었다고?\"\n\"한 번도 스스로 한 적이 없었다고?\"\n\"이게 뭐야... 이게 나라야?\"\n\n하지만 이 자백은 —\n이수연의 조종을 증명한다.\n강무현의 역할을 폭로한다.\n장경태의 OB 네트워크를 암시한다.\n\n법정에서 검사가 이 영상을 20번 돌려본다.\n\"피고인 이재민의 자백을 근거로\n공동 피고인 이수연, 강무현에 대한\n별건 수사를 요청합니다.\"\n\n이재민은 15년형을 받는다.\n하지만 이 찌질한 자백 하나가 —\n\n이수연을 법정에 세운다.\n강무현의 지시 체계를 밝힌다.\n장경태의 그림자를 드러낸다.\n\n찌질함이 역사를 바꿨다.\n\n이 자백은 진짜였을까?\n또 다른 형태의 퍼포먼스 — \"찌질한 자백\" 조차\n\"자백하는 나\"에 취한 나르시시즘이 아닌지?\n\n아무도 모른다.\n이재민 자신도.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"Camera on. No speech. Just truth — maybe. \\\"I have never done anything by myself.\\\" \\\"Everywhere, my staff did everything. I just talked.\\\" \\\"People followed me because I spent big. I mistook that for ability.\\\" \\\"My wife planned the political path. I followed.\\\" \\\"Even as president, I couldn''t understand the documents. Tonight was the first time I read one.\\\" \\\"Why martial law? I wanted — just once — to be called a strong president.\\\" \\\"That''s all.\\\" \\\"I just signed. ...Ah, that''s deflecting again, isn''t it.\\\" The most pathetic confession in history. But this confession proves Suyeon''s manipulation. Exposes Kang''s chain of command. Hints at Jang''s shadow network. One pathetic confession changes everything. Was it real? Or another performance — narcissism in the guise of self-awareness? No one knows. Not even Lee Jaemin."}',
 '{"title":{"ko":"찌질한 자백","en":"The Pathetic Confession"},"grade":"hidden"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ═══════════════════════════════════════════
-- PRESIDENT ACT 3 선택지 (choices)
-- ═══════════════════════════════════════════

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Act 3 오프닝 → BP7
('dlc_president', 'pres_act3_opening', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP7: 최후의 순간 (4지선다)
('dlc_president', 'pres_bp7', 0,
 '{"ko":"✍️ 계엄 해제 서명","en":"Sign the revocation"}',
 '{"ko":"이것만은... 내가","en":"This one... is mine"}',
 'pres_bp7_result_a', 10, '{"sobriety":3,"guilt":-2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp7', 1,
 '{"ko":"🚗 이수연 따라 도주","en":"Flee with Suyeon"}',
 '{"ko":"수연아, 나도 데려가","en":"Suyeon, take me too"}',
 'pres_bp7_result_b', 10, '{"delusion":3,"guilt":5}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp7', 2,
 '{"ko":"📺 카메라 앞에 선다","en":"Stand before the camera"}',
 '{"ko":"국민 여러분...","en":"My fellow citizens..."}',
 'pres_bp7_result_c', 10, '{"delusion":5}', NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_president', 'pres_bp7', 3,
 '{"ko":"🪞 거울 앞에 선다","en":"Stand before the mirror"}',
 '{"ko":"나는...","en":"I am..."}',
 'pres_bp7_result_d', 10, '{"sobriety":5}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP7 결과 → 엔딩 라우팅 (스탯 조건 기반)
-- Result A (계엄 해제 서명) → Best (sobriety ≥ 10) 또는 법꾸라지
('dlc_president', 'pres_bp7_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_ending_best', 0, NULL, '{"min_stats":{"sobriety":10}}', NULL, NULL, FALSE, 0, TRUE, 'sobriety', 10, 'pres_ending_eel'),

-- Result B (도주) → 법꾸라지 (끝까지 책임 안 짐)
('dlc_president', 'pres_bp7_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_ending_eel', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- Result C (카메라 연설) → Neutral Good (delusion ≥ 8, sobriety ≥ 5) 또는 법꾸라지
('dlc_president', 'pres_bp7_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_ending_speech', 0, NULL, '{"min_stats":{"sobriety":5}}', NULL, NULL, FALSE, 0, TRUE, 'sobriety', 5, 'pres_ending_eel'),

-- Result D (거울) → Hidden (ME경례+BP5검사+거울 조건 충족 시) 또는 Best
('dlc_president', 'pres_bp7_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'pres_ending_hidden', 0, NULL, '{"min_stats":{"sobriety":12}}', NULL, NULL, FALSE, 0, TRUE, 'sobriety', 12, 'pres_ending_best')

ON CONFLICT (scenario_id, node_id, choice_index) DO NOTHING;


-- ====== 20260222_seed_vip0_act1.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — VIP0 ACT 1 시나리오 데이터 시드
-- 통제 (00:00~02:00): 3 분기점 + 1 Choke Point
-- 시점: 이수연 (대통령 배우자, The Pinnacle)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- ━━━ 프롤로그: 24시간 전 ━━━
('vip0_prologue', 'dlc_vip0', 1, 'story',
 '{"ko":"━━━ 24시간 전 — The Pinnacle 관저 ━━━\n\n오후의 햇살이 대리석 바닥에 내려앉는다.\n이수연이 화장대 앞에 앉아 있다.\n\n\"엄마, 나 내일 친구들이랑 Liberty Square에 가려고.\"\n\n딸 이하은(23)이 문 앞에 서 있다.\n\n\"거기 왜?\"\n\"시민 토론회. 민주주의에 대해서...\"\n\n이수연의 눈이 차갑게 빛난다.\n\"민주주의? 네가 누구 딸인데 거기를 가.\"\n\n이하은이 돌아선다.\n\"...그래서 가는 거야.\"\n\n문이 닫힌다.\n이수연은 거울 속 자신을 본다.\n\n오늘 밤, 모든 것이 달라진다.\n오늘 밤, Directive 6.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"24 HOURS BEFORE. Daughter Haeun wants to visit Liberty Square for a democracy forum. Suyeon''s eyes turn cold. Tonight, everything changes. Tonight, Directive 6."}',
 '{}', NULL, 0, NULL, NULL),

-- ━━━ VIP0 오프닝: Directive 6 발동의 밤 ━━━
('vip0_opening', 'dlc_vip0', 1, 'story',
 '{"ko":"━━━ 오늘 밤 23:58 — The Pinnacle 집무실 ━━━\n\n남편 이재민이 책상 앞에 앉아 있다.\nVeridian 공화국의 대통령.\n하지만 지금 이 순간, 그는 그냥 겁먹은 남자다.\n\n펜을 들고 있지만, 손이 떨린다.\n\n\"... 정말 해야 하는 건가?\"\n\n이수연이 남편의 어깨에 손을 올린다.\n\n\"여보, 우리가 이 자리에 오기까지 얼마나 걸렸어.\n한세진, 그 사람이 의회에서 뭘 하고 있는지 알잖아.\n지금 안 하면 우리가 당해.\"\n\n침묵.\n\n\"...서명해.\"\n\n남편의 펜이 움직인다.\n\nDirective 6.\n계엄.\n\n이수연이 미소 짓는다.\n\"잘했어. 이제 내가 처리할게.\"\n\n그녀가 전화를 든다.\n\"장태호 사령관? 시작하세요.\"\n\n시계: 05:59:59...\n이수연의 6시간이 시작된다.\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"President Lee Jaemin''s hand trembles — Veridian''s leader, right now just a frightened man. Suyeon''s hand on his shoulder: \"Sign it.\" Directive 6 is born. She picks up the phone: \"General Jang? Begin.\" HER six hours start now."}',
 '{}', NULL, 0, NULL, NULL),

-- 분기점 V-BP1: 남편 관리
('vip0_bp1', 'dlc_vip0', 1, 'branch_main',
 '{"ko":"Directive 6에 서명한 직후.\n\n남편 이재민이 의자에 주저앉는다.\n54세. 한때는 결단력 있던 남자였다.\n하지만 30년간 이수연 옆에서 칼날이 무뎌졌다.\n\n\"...나 이거 취소할 수 있어? 아직 늦지 않았잖아?\"\n\n이수연의 눈이 날카로워진다.\n이 남자가 흔들리면 모든 게 끝난다.\n\n어떻게 이 남자를 통제하겠는가?","en":"President Lee Jaemin — 54, whose resolve dulled in 28 years beside Suyeon — just signed and is already wavering. \"Can I take it back?\" If he breaks, everything falls apart. How do you control him?"}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP1 결과 노드
('vip0_bp1_result_a', 'dlc_vip0', 1, 'story',
 '{"ko":"와인 잔을 남편 앞에 놓는다.\n\n\"여보, 잠깐 쉬어. 내가 다 챙길게.\"\n\n부드러운 목소리. 결혼 28년 동안 이 남자를 다루는 법을 완벽히 터득했다.\n\n남편이 와인을 마시고 소파에 눕는다.\n20분 후, 잠이 든다.\n\n이수연이 서재 문을 닫는다.\n이제 이 나라의 유일한 지휘관은 자신이다.\n\n[남편 무력화 — 완전한 지휘권 확보]","en":"Wine. Soft words. 28 years of marriage taught you everything about controlling this man. He falls asleep. Now you''re the sole commander."}',
 '{}', NULL, 20, '{"control":3}', 'cold_blood'),

('vip0_bp1_result_b', 'dlc_vip0', 1, 'story',
 '{"ko":"\"당신이 취소하면 어떻게 되는지 알아?\"\n\n이수연이 서류 봉투를 꺼낸다.\n스위스 계좌. 부동산 위장 매수. 측근 뇌물 기록.\n\n\"이건 우리 둘 다의 기록이야.\n취소하면 내가 이걸 먼저 공개해.\n당신만 감옥 가.\"\n\n남편의 얼굴이 하얗게 질린다.\n\n\"...알겠어. 취소 안 할게.\"\n\n[협박 성공 — 하지만 남편의 불신 축적]","en":"You pull out the Swiss accounts, the bribes, the shell companies. \"Cancel it and I leak everything. You go to prison alone.\" His face goes white."}',
 '{}', NULL, 10, '{"control":2,"trust":-2}', 'cold_blood'),

('vip0_bp1_result_c', 'dlc_vip0', 1, 'story',
 '{"ko":"남편의 손을 잡는다.\n\n\"우리 하은이 생각해봐.\n이 나라가 불안하면 하은이도 위험해.\n우리가 강하게 나가야 하은이를 지킬 수 있어.\"\n\n남편이 고개를 끄덕인다.\n\"...맞아. 하은이를 위해서라도.\"\n\n(하은이를 위해?\n그 아이는 지금 Liberty Square에 있는데.)\n\n이수연은 그 사실을 말하지 않는다.\n\n[감정 조종 성공 — 딸을 이용한 조작]","en":"\"Think of Haeun. We need to be strong to protect her.\" He nods. But Haeun is at Liberty Square right now. You don''t mention that."}',
 '{}', NULL, 15, '{"control":2,"guilt":1}', 'pragmatic'),

('vip0_bp1_result_d', 'dlc_vip0', 1, 'story',
 '{"ko":"\"여보, 카메라 앞에 서.\n국민에게 직접 말해.\"\n\n이수연이 직접 연설문을 쓴다.\n\n\"국가의 안보를 위해 부득이한 결정을 내렸습니다.\n여러분의 안전이 최우선입니다.\"\n\n남편이 떨리는 목소리로 읽는다.\n하지만 TV에서는 단호한 대통령으로 보인다.\n\n시청률이 올라간다.\n이수연이 만족스럽게 웃는다.\n\"잘했어. 이제 나머지는 내가 할게.\"\n\n[대국민 연설 — 여론 일시 안정]","en":"You write the speech yourself. He reads it with a trembling voice, but on camera he looks decisive. Ratings climb. \"Good. I''ll handle the rest.\""}',
 '{}', NULL, 25, '{"control":1,"public":2}', 'pragmatic'),

-- V-BP1 → V-BP2 연결 노드

-- ── 미니 이벤트: 진명의 전화 ──
('vip0_me_jinmyeong', 'dlc_vip0', 1, 'story',
 '{"ko":"전화가 울린다.\n\n\"선생님\"의 번호다.\n\n진명의 목소리가 나직하게 흐른다.\n\n\"자시에 움직이셨으니,\n관성의 기운이 따르고 있습니다.\n국운이 바뀌는 밤입니다.\"\n\n이수연이 묻는다.\n\"...잘 될까요, 선생님?\"\n\n\"하늘이 허락하셨습니다.\n다만... 빠른 결단이 필요합니다.\n주저하는 기운이 보입니다.\"\n\n전화를 끊는다.\n\n이수연은 안심한다.\n선생님이 그렇게 말씀하셨으니까.\n\n하지만 진명은 다른 전화를 건다.\n누군가에게.\n\n\"네, 시작됐습니다.\n저쪽은 완전히 믿고 있습니다.\"\n\n[진명의 이중 게임 — 복선]","en":"Jin Myeong calls: \"The heavens have given permission. Act decisively.\" After hanging up, she dials someone else: \"It has begun. She trusts completely.\""}',
 '{}', NULL, 5, NULL, NULL),

-- ── 미니 이벤트: 황영택 보고 ──
('vip0_me_hwang', 'dlc_vip0', 1, 'story',
 '{"ko":"태블릿에 알림.\n\n황영택이 보고한다.\n\n\"VIP0, SNS 상황 보고드립니다.\n봇 5만 개 가동 완료.\n해시태그 #대통령_지지 트렌드 1위.\n호감도 현재 62%.\"\n\n이수연이 묻는다.\n\"반대 여론은?\"\n\n\"Liberty Square에서 라이브 스트리밍 중입니다.\n차단은 가능하지만... 그러면 더 커집니다.\"\n\n이수연이 생각한다.\n\n황영택은 항상 웃고 있다.\n항상 해결사.\n하지만 그 해결사가\n이수연이 무너지면\n가장 먼저 검찰에 달려갈 사람이라는 걸\n이수연은 아직 모른다.\n\n[황영택의 여론 조작 — 현재 진행 중]","en":"Hwang reports: 50K bots live, #PresidentSupport trending #1, 62% approval. He always smiles. But if you fall, he runs to the prosecutor first."}',
 '{}', NULL, 5, NULL, NULL),

('vip0_pre_bp2', 'dlc_vip0', 1, 'story',
 '{"ko":"시간: 약 05:30:00 남음\n\n비서실장이 보고한다.\n\"VIP0. 문제가 있습니다.\"\n\n\"무슨 문제?\"\n\n\"한세진이... 의회를 향해 이동 중입니다.\n그리고 의원들이 하나둘 합류하고 있습니다.\"\n\n이수연의 미소가 사라진다.\n\n\"...그 작자가 아직도?\"\n\n\"그리고 하나 더. VBS 방송국에서 누군가 송출을 시도하고 있습니다.\"\n\n모든 것을 통제해야 한다.\n언론부터.","en":"The chief of staff reports: Han Sejin is moving toward the Assembly. Lawmakers are joining him. And someone is trying to broadcast from VBS."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP2: 언론 통제
('vip0_bp2', 'dlc_vip0', 1, 'branch_main',
 '{"ko":"한세진이 움직이고 있다. 언론이 깨어나고 있다.\nVBS에서 누군가 방송을 시도하고 있다.\n\n이수연은 관저에서 전화기와 모니터만으로\n이 나라를 통제해야 한다.\n\n어떻게 정보를 장악하겠는가?","en":"Han Sejin is moving. The media is waking up. Someone at VBS is trying to broadcast. You must control the narrative from The Pinnacle with only phones and monitors."}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP2 결과 노드
('vip0_bp2_result_a', 'dlc_vip0', 1, 'story',
 '{"ko":"\"VBS 사장에게 전화해.\"\n\n이수연이 직접 VBS 사장과 통화한다.\n\"지금 방송 나가면 당신 아들 해외 유학 어떻게 되는지 알지?\"\n\n10분 후, VBS가 사전 패턴 화면으로 전환된다.\n방송은 차단되었다.\n\n하지만... 사라 첸이 이미 외신 라인을 열었다.\n국내 언론은 막았지만, 해외는?\n\n[국내 방송 차단 — 하지만 외신 통제 실패]","en":"You threaten the VBS director''s son''s overseas scholarship. Domestic broadcast killed. But Sarah Chen already opened foreign press lines."}',
 '{}', NULL, 15, '{"media":-2,"control":2}', 'cold_blood'),

('vip0_bp2_result_b', 'dlc_vip0', 1, 'story',
 '{"ko":"강무현에게 전화한다.\n\n\"정보부장, Protocol Zero를 발동해.\n전 국가 통신 차단.\"\n\n강무현이 침묵한다.\n\n\"...VIP0, 그건 대통령 직접 승인이 필요합니다.\"\n\"대통령은 자고 있어. 내가 승인해.\"\n\n다시 침묵.\n\n\"...알겠습니다.\"\n\n30분 후, Centris 전역의 인터넷과 전화가 끊긴다.\n\n강무현이 중얼거린다.\n\"이 여자... 진짜 하는구나.\"\n\n[Protocol Zero 발동 — 전면 통신 차단]","en":"You order Intelligence Director Kang to activate Protocol Zero. Full communications blackout. Kang mutters: \"She actually did it.\""}',
 '{"links_to":"act2_choke2"}', NULL, 20, '{"control":4,"media":-3}', 'cold_blood'),

('vip0_bp2_result_c', 'dlc_vip0', 1, 'story',
 '{"ko":"\"김보좌관한테 연결해.\"\n\n이수연이 의회 내부에 심어둔 스파이에게 직접 지시한다.\n\n\"한세진이 뭘 하고 있어?\"\n\"의원들을 소집하고 있습니다, VIP0.\"\n\"막아. 내부에서 분열시켜.\n의원들한테 ''군부와 협조하면 안전''이라고 흘려.\"\n\n김보좌관이 움직이기 시작한다.\n\n이수연은 이제 적의 심장부에 자신의 눈과 귀를 갖고 있다.\n\n[의회 내부 스파이 가동 — Act 2에서 배신자 이벤트 연결]","en":"You activate your spy inside the Assembly — aide Kim. \"Divide them from within.\" Now you have eyes in the enemy''s heart."}',
 '{"links_to":"act2_bp5"}', NULL, 10, '{"intel":3,"control":2}', 'conspiring'),

('vip0_bp2_result_d', 'dlc_vip0', 1, 'story',
 '{"ko":"이수연이 직접 SNS 계정을 연다.\n@FirstLady_Veridian.\n\n\"국민 여러분, 저는 지금 관저에서 안전합니다.\n대통령이 어려운 결정을 내렸습니다.\n하지만 저는 국민 여러분 곁에 있습니다.\n부디 침착하게 기다려 주세요.\"\n\n댓글이 쏟아진다.\n\"역시 이수연님!\" \"우리 퍼스트레이디!\"\n\n하지만 일부에서:\n\"계엄을 지지하는 건가?\" \"이 위선자!\"\n\n분열된 반응. 하지만 시간은 벌었다.\n\n[SNS 여론전 — 시간 확보, 여론 분열]","en":"You post on social media as the caring First Lady. Comments flood in — supporters and critics. Opinion splits, but you bought time."}',
 '{}', NULL, 20, '{"public":1,"media":1}', 'pragmatic'),

-- V-BP2 → V-BP3 연결
('vip0_pre_bp3', 'dlc_vip0', 1, 'story',
 '{"ko":"시간: 약 05:00:00 남음\n\n모든 것이 계획대로 돌아가고 있었다.\n\n그때, 이수연의 개인 폰이 울린다.\n\n발신자: 하은\n\n심장이 쿵 내려앉는다.\n\n전화를 받자, 딸의 목소리가 울리고 있다.\n\n\"엄마... 나 Liberty Square에 있어.\n여기 군인들이 와. 사람들이 무서워하고 있어.\n엄마가 한 거야? 이거 엄마가 한 거 맞지?\"\n\n이수연의 손이 떨린다.\n\n\"...하은아.\"","en":"Your personal phone rings. It''s Haeun, crying. \"Mom, I''m at Liberty Square. Soldiers are here. Did you do this? This was you, wasn''t it?\""}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP3: 딸의 전화
('vip0_bp3', 'dlc_vip0', 1, 'branch_main',
 '{"ko":"딸 이하은이 Liberty Square에 있다.\n군인들이 주변을 에워싸고 있다.\n딸이 울면서 묻는다.\n\n\"이거 엄마가 한 거 맞지?\"\n\n온 세상을 통제할 수 있다.\n하지만 이 아이만은...\n\n어떻게 대응하겠는가?","en":"Your daughter is at Liberty Square, surrounded by soldiers. She''s crying: \"This was you, wasn''t it?\" You can control the world... but not this child."}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP3 결과 노드
('vip0_bp3_result_a', 'dlc_vip0', 1, 'story',
 '{"ko":"\"하은아, 지금 당장 경호원을 보낼게.\n거기서 나와. 집에 와.\"\n\n\"싫어! 나는 여기 사람들이랑 있을 거야!\"\n\n\"...듣지 않으면 니 해외 카드 다 정지시킨다.\"\n\n전화가 끊긴다.\n\n이수연이 경호실에 전화한다.\n\"Liberty Square에 있는 이하은을 데려와. 필요하면 강제로.\"\n\n딸을 보호?\n아니면 가두는 것인가?\n\n[딸 강제 보호 — 하지만 관계 파괴]","en":"\"I''ll send guards. Come home.\" \"No!\" \"Then I''ll cancel all your cards.\" You order the security team to retrieve her — by force if necessary."}',
 '{}', NULL, 15, '{"control":2,"guilt":3}', 'cold_blood'),

('vip0_bp3_result_b', 'dlc_vip0', 1, 'story',
 '{"ko":"전화를 내려다본다.\n\n받지 않는다.\n\n벨이 10번 울리고 멈춘다.\n부재중 통화: 하은 (3건).\n\n이수연이 전화기를 서랍에 넣는다.\n\n\"지금은... 감정적인 판단을 할 때가 아니야.\"\n\n거울에 비친 자신의 얼굴.\n눈가가 젖어 있지만, 입술은 단단히 다물어져 있다.\n\n[전화 무시 — 시간 절약, 하지만 Act 3에서 딸 접촉 불가]","en":"You stare at the phone. 10 rings. You put it in a drawer. \"I can''t be emotional right now.\" Your eyes are wet, but your lips are sealed."}',
 '{}', NULL, 5, '{"control":1,"guilt":2}', 'cold_blood'),

('vip0_bp3_result_c', 'dlc_vip0', 1, 'story',
 '{"ko":"\"하은아... 엄마가 미안해.\n하지만 이건 복잡한 거야.\n넌 이해 못해.\"\n\n\"이해 못 한다고? 엄마 때문에 사람들이 무서워하고 있어!\"\n\n\"엄마는 이 나라를 위해서...\"\n\n\"나라를 위해?!\n엄마는 자기를 위해서 그런 거잖아!\"\n\n전화가 끊긴다.\n\n이수연이 천천히 앉는다.\n\n\"...그 애가 뭘 알아.\"\n\n하지만 심장이 아프다.\n\n[자기합리화 — 감정 데미지, 하지만 Act 3 대화 루트 유지]","en":"\"Mom did this for the country.\" \"For the country?! You did it for yourself!\" The call ends. You sit down slowly. Your heart aches."}',
 '{}', NULL, 15, '{"guilt":1}', 'pragmatic'),

('vip0_bp3_result_d', 'dlc_vip0', 1, 'story',
 '{"ko":"이수연이 전화를 받는다.\n\n\"하은아.\"\n\n딸이 울고 있다.\n\n\"...\"\n\n이수연도 말이 나오지 않는다.\n\n하지만 손이 움직인다.\n경호 주파수로 문자를 보낸다.\n\n\"Liberty Square 구역 하은 위치 주변 비폭력 유지.\n절대 총 쏘지 마.\"\n\n전화기 너머에서 딸의 숨소리가 들린다.\n\n\"...엄마도 무서워, 하은아.\"\n\n(솔직한 건지, 조작인지, 이수연 자신도 모른다.)\n\n[숨겨진 인간성 — 딸 주변 비폭력 명령. Act 3 화해 루트 해금]","en":"You can''t speak. But your hand moves — you text the security channel: ''Nonviolent protocol around Haeun.'' \"Mom is scared too, Haeun.\" Even you don''t know if it''s real or manipulation."}',
 '{}', NULL, 20, '{"guilt":-1,"empathy":3}', 'humanist'),

-- ⭐ VIP0 Choke Point: 첫 보고
('vip0_choke1', 'dlc_vip0', 1, 'choke',
 '{"ko":"━━━ SITUATION ROOM ━━━\n\n관저 지하 상황실.\n벽면의 모니터에 Centris 전역이 비친다.\n\n모니터 1: Grand Assembly — 한세진 도착. 의원 47명 집결.\n모니터 2: Liberty Square — 시민 수천 명 집결.\n모니터 3: 군 이동 — 장갑차 12대 Centris 진입 중.\n모니터 4: 국제 — CNN, BBC 속보 자막.\n\n이수연이 의자에 앉는다.\n체스 게임처럼 말들을 바라본다.\n\n\"한세진. 6시간 안에 정족수를 모으겠다고?\n내가 그걸 보고만 있을 것 같아?\"\n\n━━━ ACT 2: 균열 ━━━","en":"Situation Room under The Pinnacle. Four monitors showing the chess board. Han Sejin has 47 lawmakers. Suyeon watches from her throne: ''You think I''ll just sit here?''"}',
 '{}', NULL, 5, NULL, NULL),

-- Act 1 실패 노드
('vip0_act1_fail', 'dlc_vip0', 1, 'ending',
 '{"ko":"이재민이 갑자기 일어난다.\n\n\"나 Directive 6 취소할 거야!\"\n\n이수연이 막으려 하지만, 남편이 직접 TV 카메라 앞에 선다.\n\"계엄을... 취소합니다...\"\n\n이수연의 세계가 무너진다.\n\n\"당신... 뭘 한 거야?\"\n\n[통제 실패 엔딩]\n[영구 해금: 대통령의 내면]","en":"Lee Jaemin suddenly stands up — for the first time in 28 years acting alone — and cancels Directive 6 on live TV. Your world collapses. \"What have you done?\""}',
 '{"title":{"ko":"왕좌의 반란","en":"Rebellion from the Throne"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── VIP0 ACT 1 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- 프롤로그 → 오프닝
('dlc_vip0', 'vip0_prologue', 0, '{"ko":"그날 밤...","en":"That night..."}', '{"ko":"","en":""}', 'vip0_opening', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 오프닝 → BP1
('dlc_vip0', 'vip0_opening', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 V-BP1: 남편 관리
('dlc_vip0', 'vip0_bp1', 0,
 '{"ko":"🍷 와인과 다독임 — 부드럽게 재우기","en":"Wine and comfort — put him to sleep gently"}',
 '{"ko":"28년간의 결혼 노하우를 사용한다","en":"Use 28 years of marriage expertise"}',
 'vip0_bp1_result_a', 20, '{"control":3}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp1', 1,
 '{"ko":"📄 약점 협박 — 스위스 계좌로 위협","en":"Threaten with Swiss accounts"}',
 '{"ko":"당신만 감옥 간다... 알지?","en":"You go to prison alone... you know that, right?"}',
 'vip0_bp1_result_b', 10, '{"control":2,"trust":-2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp1', 2,
 '{"ko":"❤️ 딸을 이용한 감정 조종","en":"Emotional manipulation using your daughter"}',
 '{"ko":"하은이를 지키려면 강해져야 해","en":"We must be strong to protect Haeun"}',
 'vip0_bp1_result_c', 15, '{"control":2,"guilt":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp1', 3,
 '{"ko":"📺 대국민 연설 시키기","en":"Force a presidential address"}',
 '{"ko":"카메라 앞에 세우면 취소 못 해","en":"He can''t cancel it once he''s on camera"}',
 'vip0_bp1_result_d', 25, '{"control":1,"public":2}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP1 결과 → pre_bp2
('dlc_vip0', 'vip0_bp1_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_me_jinmyeong', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp1_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_me_jinmyeong', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp1_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_me_jinmyeong', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp1_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_me_jinmyeong', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp2 → BP2
('dlc_vip0', 'vip0_me_jinmyeong', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_me_hwang', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_me_hwang', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_pre_bp2', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 V-BP2: 언론 통제
('dlc_vip0', 'vip0_bp2', 0,
 '{"ko":"📞 VBS 사장 직접 협박","en":"Threaten VBS director directly"}',
 '{"ko":"아들 유학 문제를 언급한다","en":"Mention his son''s overseas scholarship"}',
 'vip0_bp2_result_a', 15, '{"media":-2,"control":2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp2', 1,
 '{"ko":"🔒 Protocol Zero 발동 명령","en":"Order Protocol Zero activation"}',
 '{"ko":"전 국가 통신 차단. 인터넷, 전화, 전부.","en":"Full national communications blackout"}',
 'vip0_bp2_result_b', 20, '{"control":4,"media":-3}', '{"control":{"min":3}}', 'cold_blood', '{"kang_muhyun":1}', FALSE, 0, TRUE, 'control', 3, 'vip0_act1_fail'),

('dlc_vip0', 'vip0_bp2', 2,
 '{"ko":"🕵️ 의회 내부 스파이 가동","en":"Activate your spy inside the Assembly"}',
 '{"ko":"김보좌관에게 내부 분열 지시","en":"Order aide Kim to divide them from within"}',
 'vip0_bp2_result_c', 10, '{"intel":3,"control":2}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp2', 3,
 '{"ko":"📱 SNS 여론전 — 자애로운 퍼스트레이디","en":"Social media PR — the caring First Lady"}',
 '{"ko":"국민 감성을 자극해 시간을 번다","en":"Appeal to emotions to buy time"}',
 'vip0_bp2_result_d', 20, '{"public":1,"media":1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP2 결과 → pre_bp3
('dlc_vip0', 'vip0_bp2_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp2_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp2_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp2_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp3 → BP3
('dlc_vip0', 'vip0_pre_bp3', 0, '{"ko":"전화를 본다...","en":"You look at the phone..."}', '{"ko":"","en":""}', 'vip0_bp3', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- 분기점 V-BP3: 딸의 전화
('dlc_vip0', 'vip0_bp3', 0,
 '{"ko":"🔐 경호원을 보내 강제 귀가","en":"Send guards to take her home by force"}',
 '{"ko":"보호? 감금? 그 경계가 모호하다","en":"Protection? Imprisonment? The line blurs."}',
 'vip0_bp3_result_a', 15, '{"control":2,"guilt":3}', NULL, 'cold_blood', '{"haeun":-3}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp3', 1,
 '{"ko":"📵 전화 무시 — 지금은 안 된다","en":"Ignore the call — not now"}',
 '{"ko":"감정에 휘둘리면 안 된다","en":"I can''t let emotions control me"}',
 'vip0_bp3_result_b', 5, '{"control":1,"guilt":2}', NULL, 'cold_blood', '{"haeun":-2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp3', 2,
 '{"ko":"💬 자기합리화 — 나라를 위한 거라고","en":"Self-justification — it''s for the country"}',
 '{"ko":"\"넌 이해 못 해. 엄마가 하는 일을.\"","en":"\"You don''t understand what I''m doing.\""}',
 'vip0_bp3_result_c', 15, '{"guilt":1}', NULL, 'pragmatic', '{"haeun":-1}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp3', 3,
 '{"ko":"😢 숨겨진 인간성 — 딸 주변 비폭력 명령","en":"Hidden humanity — order nonviolence near her"}',
 '{"ko":"\"엄마도 무서워, 하은아.\"","en":"\"Mom is scared too, Haeun.\""}',
 'vip0_bp3_result_d', 20, '{"guilt":-1,"empathy":3}', NULL, 'humanist', '{"haeun":2}', TRUE, 80, FALSE, NULL, NULL, NULL),

-- BP3 결과 → Choke Point 1
('dlc_vip0', 'vip0_bp3_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp3_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp3_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp3_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke1', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ VIP0 ACT 1 시나리오 시드 완료


-- ====== 20260222_seed_vip0_act2.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — VIP0 ACT 2 시나리오 데이터 시드
-- 균열 (02:00~04:00): 3 분기점 + 1 Choke Point
-- 시점: 이수연 (The Pinnacle 상황실)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- BP4 도입부
('vip0_pre_bp4', 'dlc_vip0', 2, 'story',
 '{"ko":"시간: 약 04:00:00 남음\n\n상황실 모니터에 숫자가 올라간다.\n의회 내 의원 수: 47 → 62 → 78.\n\n\"...왜 계속 늘어나?\"\n\n비서실장이 땀을 닦는다.\n\"한세진이 SNS로 소집 메시지를 보낸 것 같습니다.\n일부 의원들이 담을 넘어 의회에 진입했습니다.\"\n\n이수연의 손톱이 테이블을 파고든다.\n\"담을 넘었다고?\"\n\n모니터 한쪽에 Liberty Square가 보인다.\n촛불이 점점 늘어나고 있다.\n그 속에... 딸이 있다.\n\n통제력이 무너지기 시작한다.","en":"Assembly count climbs: 47 → 62 → 78. Lawmakers are scaling walls to get in. At Liberty Square, your daughter holds a candle among thousands. Control is slipping."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP4: 장태호 독촉
('vip0_bp4', 'dlc_vip0', 2, 'branch_main',
 '{"ko":"한세진이 의원을 모으고 있다. 정족수(151)에 점점 가까워진다.\n장태호의 군대는 아직 완전히 진입하지 않았다.\n\n관저에서 할 수 있는 건 전화뿐이다.\n장태호에게 뭐라고 하겠는가?","en":"Han Sejin is gathering lawmakers. Getting close to quorum (151). Jang''s army hasn''t fully moved in. From The Pinnacle, all you have is a phone."}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP4 결과
('vip0_bp4_result_a', 'dlc_vip0', 2, 'story',
 '{"ko":"\"장태호! 지금 당장 들어가!\n뭘 기다리는 거야!\"\n\n장태호의 목소리가 차갑다.\n\"VIP0, 저는 대통령의 명령을 받습니다.\n당신의 명령이 아닙니다.\"\n\n\"대통령은 내가...\"\n\n\"대통령은 지금 자고 계시다고 들었습니다.\n당신이 재운 거 아닙니까.\"\n\n전화가 끊긴다.\n\n이수연이 전화기를 바닥에 내던진다.\n\n[장태호 반발 — 통제력 하락]","en":"You scream at Jang: \"Move in NOW!\" His cold reply: \"I take orders from the president. Not you. And I hear he''s sleeping — because you drugged him.\" Click."}',
 '{}', NULL, 15, '{"control":-2}', 'cold_blood'),

('vip0_bp4_result_b', 'dlc_vip0', 2, 'story',
 '{"ko":"목소리를 낮춘다.\n\n\"장태호 사령관, 이 작전이 성공하면\n국방장관 자리는 당신 겁니다.\n실패하면... 글쎄요.\n당신 아들이 어디 있는지 아시죠?\"\n\n침묵.\n\n\"...30분 후 진입합니다.\"\n\n이수연이 미소 짓는다.\n하지만 거울에 비친 자신의 표정은...\n무섭다.\n\n[뒷거래 성공 — Red Dawn 가속]","en":"You lower your voice: career bribe plus veiled threat about his son. \"...30 minutes.\" You smile. But the face in the mirror is terrifying."}',
 '{"links_to":"act3_bp8"}', NULL, 10, '{"control":3}', 'cold_blood'),

('vip0_bp4_result_c', 'dlc_vip0', 2, 'story',
 '{"ko":"\"백준서, 장태호를 교체할 수 있어?\"\n\n총리 백준서가 당황한다.\n\"VIP0, 계엄 사령관은 대통령만 교체할 수...\"\n\n\"대통령은 내가 관리해.\n니가 부사령관 쪽에 라인 있지?\"\n\n백준서가 한숨을 쉰다.\n\"...이간질입니까?\"\n\n\"이간질이 아니라 인사라고 해.\n너도 이 상황 끝나면 더 큰 자리에 앉고 싶잖아.\"\n\n백준서의 눈빛이 달라진다. 일순간, 계산하는 눈.\n\n[군 내부 분열 시도 — 위험하지만 대담]","en":"You try to replace Jang through back channels. Baek sighs: \"You''re playing them against each other.\" \"It''s not manipulation. It''s management.\""}',
 '{}', NULL, 25, '{"control":1,"intel":2}', 'conspiring'),

('vip0_bp4_result_d', 'dlc_vip0', 2, 'story',
 '{"ko":"전화기를 내려놓는다.\n\n\"...장태호는 알아서 하겠지.\"\n\n이수연이 모니터를 바라본다.\nLiberty Square의 촛불이 화면을 가득 채운다.\n\n\"저 사람들이 뭘 원하는 거야...\"\n\n처음으로, 의문이 스친다.\n자신이 하고 있는 일의 의미에 대해.\n\n(하지만 그 의문은 빠르게 사라진다.)\n\n[수동적 관망 — 시간 소모, 하지만 죄책감 감소]","en":"You put down the phone and watch the candlelight fill Liberty Square. For the first time, doubt crosses your mind. (It passes quickly.)"}',
 '{}', NULL, 30, '{"guilt":-1}', 'humanist'),

-- BP5 도입부
('vip0_pre_bp5', 'dlc_vip0', 2, 'story',
 '{"ko":"비서관이 헐레벌떡 들어온다.\n\n\"VIP0! 해외 계좌 문제입니다!\n누군가 우리 자금 흐름을 추적하고 있습니다.\n스위스 은행에서 확인 전화가 왔습니다.\"\n\n이수연의 얼굴이 딱딱해진다.\n\n\"...누가?\"\n\n\"모릅니다. 하지만 정보부 쪽에서 ''Sentinel''이라는\n내부 고발 네트워크를 언급했습니다.\"\n\n심장이 멈추는 것 같다.\n\n비자금. 해외 부동산. 명품 구매 내역.\n전부 밝혀지면...","en":"Your aide bursts in: \"Someone is tracking our money! The Swiss bank called.\" Sentinel — a whistleblower network — is mentioned. Your heart stops. The slush funds. Foreign properties. Luxury purchases."}',
 '{"links_to":"act2_bp6"}', NULL, 5, NULL, NULL),

-- 분기점 V-BP5: 비자금 위기
('vip0_bp5', 'dlc_vip0', 2, 'branch_main',
 '{"ko":"스위스 계좌. 해외 부동산. 페이퍼 컴퍼니.\n이수연이 10년간 축적한 비밀이 흔들리고 있다.\n\nSentinel이라는 네트워크가 추적 중이다.\n\n어떻게 대응하겠는가?","en":"Swiss accounts. Foreign properties. Shell companies. 10 years of secrets shaking. Sentinel is tracking you. What do you do?"}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP5 결과
('vip0_bp5_result_a', 'dlc_vip0', 2, 'story',
 '{"ko":"\"전부 지워.\"\n\n이수연이 직접 노트북을 연다.\n은행 온라인 시스템에 접속.\n계좌 10개를 순서대로 폐쇄한다.\n\n돈은 새로운 페이퍼 컴퍼니로 이전.\n디지털 증거는 삭제.\n\n\"...이래도 되는 건가?\"\n\n비서관이 묻는다.\n\n\"안 되면 어떡해. 감옥 갈 거야?\"\n\n45분 후, 대부분의 흔적이 사라졌다.\n하지만 오프라인 문서는... 아직 The Pinnacle 금고에.\n\n[디지털 증거 인멸 — 하지만 물리적 증거 잔존]","en":"You close 10 accounts yourself. Transfer funds to new shells. Delete digital trails. \"Is this okay?\" \"Would you prefer prison?\" But offline documents remain in The Pinnacle safe."}',
 '{}', NULL, 45, '{"control":2}', 'cold_blood'),

('vip0_bp5_result_b', 'dlc_vip0', 2, 'story',
 '{"ko":"\"강무현에게 연결해.\"\n\n정보부장 강무현이 차분한 목소리로 받는다.\n\"VIP0, 예상했습니다.\"\n\n\"Sentinel을 찾아서 없애.\"\n\n\"Sentinel을... 없앤다고요?\"\n\n\"무슨 수를 써서든.\"\n\n강무현이 침묵한다.\n그리고 이상한 말을 한다.\n\n\"...VIP0, Sentinel에 대해\n한 가지 알아야 할 것이 있습니다.\"\n\n\"뭔데?\"\n\n\"...아닙니다. 처리하겠습니다.\"\n\n(강무현은 무엇을 숨기고 있는가?)\n\n[강무현에게 Sentinel 제거 의뢰 — 하지만 그의 의도는?]","en":"You call Kang Muhyun: \"Find and destroy Sentinel.\" A strange pause. \"There''s something you should know about Sentinel...\" \"What?\" \"...Never mind. I''ll handle it.\" What is he hiding?"}',
 '{"links_to":"ending_e8"}', NULL, 15, '{"intel":2}', 'conspiring'),

('vip0_bp5_result_c', 'dlc_vip0', 2, 'story',
 '{"ko":"이수연이 깊은 숨을 쉰다.\n\n\"...이건 국가를 위한 자금이야.\n내가 개인적으로 쓴 게 아니라\n나라 운영을 위해 필요한 거야.\"\n\n비서관이 고개를 갸웃한다.\n\"그... 에르메스 버킨백 17개도요?\"\n\n\"그건...\"\n\n침묵.\n\n\"닥쳐. 그리고 나가.\"\n\n혼자 남은 방.\n거울 속의 자신에게 묻는다.\n\"...정말 나라를 위해서였어?\"\n\n(답은 오지 않는다.)\n\n[자기합리화 실패 — 내면의 균열 심화]","en":"\"It was for the country.\" \"The 17 Hermès bags too?\" Silence. \"Shut up. Get out.\" Alone, you ask the mirror: \"Was it really for the country?\" No answer comes."}',
 '{}', NULL, 10, '{"guilt":3}', 'pragmatic'),

('vip0_bp5_result_d', 'dlc_vip0', 2, 'story',
 '{"ko":"이수연이 전화를 든다.\n국제 포럼 의장 마이클 셸턴.\n\n\"마이클, 나야. 내 돈 좀 옮겨야 해.\n케이맨 제도 쪽으로.\"\n\n\"수연, 지금 Veridian이 계엄 중인데...\"\n\n\"그래서 지금 해야지. 혼란할 때 움직여야\n눈에 안 띄잖아.\"\n\n마이클이 한숨을 쉰다.\n\"...50%는 수수료야.\"\n\n\"거래. 진행해.\"\n\n[해외 자금 이전 — 비용 50%, 하지만 안전 확보]","en":"You call an international contact to move money to the Caymans. \"50% fee.\" \"Deal.\" The chaos of martial law is perfect cover for financial maneuvers."}',
 '{}', NULL, 20, '{"control":1}', 'cold_blood'),

-- ── 전하윤 도피 제안 서브 이벤트 ──
('vip0_sub_hayoon', 'dlc_vip0', 2, 'story',
 '{"ko":"관저 안방.\n\n전하윤이 조용히 들어온다.\n\n\"수연 님, 다 준비했어요.\n중동행 전세기. 새 여권. 계좌도 정리했어요.\"\n\n이수연이 돌아본다.\n\n\"...넌 왜 이렇게까지?\n대체 뭘 원하는 거야?\"\n\n전하윤이 웃는다.\n완벽하게 계산된 미소.\n\n\"수연 님이 편안하시면 돼요.\n그게 저의 행복이에요.\"\n\n하지만 그 눈.\n계산하는 눈.\n해외 페이퍼 컴퍼니 3개.\n총 자산 추정 300억.\n이수연의 비자금을 세탁하면서,\n동시에 자기 계좌를 불린 사람.\n\n이수연이 몰락하면\n가장 먼저 사라질 사람.\n가장 많이 가지고 갈 사람.\n\n[전하윤의 진심? 계산? — 관계 복선]","en":"Hayoon enters quietly: \"Everything is ready. Private jet. New passport. Accounts transferred.\" Her smile is perfectly calculated. If you fall, she disappears first — with the most."}',
 '{}', NULL, 10, NULL, NULL),

-- BP6 도입부
('vip0_pre_bp6', 'dlc_vip0', 2, 'story',
 '{"ko":"시간: 약 02:30:00 남음\n\n비서관이 태블릿을 들고 온다.\n\n\"VIP0, 이것 좀 보셔야 합니다.\"\n\n화면에 딸 이하은의 얼굴.\nLiberty Square에서 마이크를 잡고 있다.\n\n\"저는 대통령의 딸입니다!\n그리고 저는 아버지의 결정에 반대합니다!\"\n\n군중이 환호한다.\n\n이수연의 얼굴이 하얗게 변한다.\n\n\"이 미친...\"","en":"A tablet is thrust in your face. On screen: your daughter Haeun at Liberty Square, holding a microphone. \"I am the president''s daughter, and I oppose my father''s decision!\" The crowd roars."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP6: 딸의 배신 (공개 반대 선언)
('vip0_bp6', 'dlc_vip0', 2, 'branch_main',
 '{"ko":"딸 이하은이 Liberty Square에서 공개적으로 아버지(그리고 어머니)에 반대했다.\n\nCNN이 생중계하고 있다.\n\"대통령의 딸이 계엄에 반대!\"\n\n이 상황은... 어떤 언론 통제보다 파괴적이다.\n\n어떻게 대응하겠는가?","en":"Your daughter publicly opposes you on live international television. CNN broadcasts: \"President''s daughter stands against martial law!\" This is more destructive than any media you could control."}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP6 결과
('vip0_bp6_result_a', 'dlc_vip0', 2, 'story',
 '{"ko":"\"경호실, 이하은을 데려와.\n강제로라도.\"\n\n20분 후.\n\n카메라 앞에서 경호원들이 이하은을 끌고 가는 장면이 찍힌다.\n\n\"놓으세요! 저는 시민입니다!\"\n\n전 세계가 본다.\n\"독재자의 아내가 자기 딸을 납치\"\n\n이수연이 모니터를 끈다.\n\n[딸 강제 확보 — 국제 이미지 치명상]","en":"Guards drag Haeun away on live camera. \"Let go! I am a citizen!\" The headline: \"Dictator''s wife kidnaps own daughter.\" You turn off the monitor."}',
 '{}', NULL, 20, '{"control":1,"public":-5,"guilt":4}', 'cold_blood'),

('vip0_bp6_result_b', 'dlc_vip0', 2, 'story',
 '{"ko":"언론 대응팀에 지시한다.\n\n\"하은이가 적에게 이용당한 거라고 발표해.\n약물을 투여당했을 가능성.\n강제로 참여시킨 혐의.\"\n\n30분 후, 친정부 언론이 보도한다.\n\"대통령 영애, 시위대에 납치 의혹\"\n\n하지만 SNS에서는:\n\"거짓말! 영상 보면 자발적으로 말하고 있잖아!\"\n\n진실은 영상에 찍혀 있다.\n거짓말은 통하지 않는다.\n\n[프레이밍 시도 — 부분적 성공, SNS 역풍]","en":"You spin it: \"She was drugged by protesters.\" State media runs it. But social media has the video. \"She''s clearly speaking voluntarily!\" The lie crumbles."}',
 '{}', NULL, 25, '{"media":1,"public":-3}', 'pragmatic'),

('vip0_bp6_result_c', 'dlc_vip0', 2, 'story',
 '{"ko":"이수연이 모니터 앞에 주저앉는다.\n\n딸이... 자신에게 등을 돌렸다.\n\n\"...그래. 니 마음대로 해.\n엄마는 더 이상 상관 안 해.\"\n\n하지만 눈물이 흐른다.\n\n비서관이 조심스럽게 묻는다.\n\"VIP0, 괜찮으시...\"\n\n\"괜찮다고 했잖아!\" \n\n첫 번째 균열.\n철벽 같던 이수연의 갑옷에 금이 간다.\n\n[심리적 붕괴 시작 — Act 3 각성 루트 해금 가능]","en":"You collapse in front of the monitor. Your daughter turned against you. Tears flow for the first time. The first crack in your iron armor."}',
 '{}', NULL, 10, '{"guilt":3,"control":-2}', 'humanist'),

('vip0_bp6_result_d', 'dlc_vip0', 2, 'story',
 '{"ko":"전화기를 든다.\n딸에게 직접 전화한다.\n\n\"하은아.\"\n\"전화하지 마.\"\n\"엄마 잠깐만 들어봐.\"\n\"들을 말 없어.\"\n\n\"...네가 옳을 수도 있어.\"\n\n침묵.\n\n\"뭐?\"\n\n\"엄마가... 틀렸을 수도 있어.\n하지만 지금은 설명할 수 없어.\n제발... 안전한 곳에 있어.\"\n\n딸이 전화를 끊지 않는다.\n\n오래 침묵이 흐른다.\n\n\"...엄마, 뭘 하고 있는 거야, 도대체.\"\n\n[진심 소통 — Act 3 화해/각성 루트 강화]","en":"You call Haeun directly. \"You might be right.\" A long silence. \"Mom... what are you doing?\" The line stays open. Something shifts."}',
 '{}', NULL, 20, '{"guilt":-2,"empathy":4}', 'humanist'),

-- ⭐ VIP0 Choke Point 2: 거울
('vip0_choke2', 'dlc_vip0', 2, 'choke',
 '{"ko":"━━━ THE MIRROR ━━━\n\n새벽 3시.\n상황실에서 잠깐 나온 이수연.\n\n화장실 거울 앞에 선다.\n\n마스카라가 번졌다.\n립스틱이 지워졌다.\n\n거울 속의 여자가 묻는다.\n\n\"넌 누구야?\"\n\n\"이수연. 이 나라의 퍼스트레이디.\"\n\n\"아니, 넌 누구야, 정말로?\"\n\n\"...\"\n\n어릴 적 기억이 스친다.\n가난한 고시원. 쌀이 없던 날.\n\"다시는 아무것도 없는 사람이 되지 않겠다.\"\n\n그 맹세가 자신을 여기까지 데려왔다.\n하지만 그 맹세가 자신을 괴물로 만들었다.\n\n━━━ ACT 3: 붕괴 ━━━","en":"3 AM. The bathroom mirror. Smeared mascara. Faded lipstick. The woman in the mirror asks: \"Who are you, really?\" A childhood vow in a rice-less room: \"Never be nothing again.\" That vow brought you here. That vow made you a monster."}',
 '{}', NULL, 5, NULL, NULL),

-- Act 2 실패 노드
('vip0_act2_fail', 'dlc_vip0', 2, 'ending',
 '{"ko":"비자금 증거가 CNN에 유출되었다.\n\n이수연의 이름, 계좌 번호, 명품 구매 내역.\n전 세계가 본다.\n\n남편이 깨어난다.\n\"이게... 이게 뭐야?!\"\n\n\"여보, 이건...\"\n\n\"당신 때문이야! 전부 당신 때문이야!\"\n\n관저 앞에 시민들이 몰려온다.\n\n[내부 폭로 엔딩]","en":"Your financial records leak to CNN. The president wakes up: \"This is all YOUR fault!\" Citizens surge toward The Pinnacle."}',
 '{"title":{"ko":"유리 천장","en":"Glass Ceiling"},"grade":"bad"}', NULL, 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── VIP0 ACT 2 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Choke1 → pre_bp4
('dlc_vip0', 'vip0_choke1', 0, '{"ko":"Act 2로 진행","en":"Proceed to Act 2"}', '{"ko":"","en":""}', 'vip0_pre_bp4', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp4 → BP4
('dlc_vip0', 'vip0_pre_bp4', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp4', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP4: 장태호 독촉
('dlc_vip0', 'vip0_bp4', 0,
 '{"ko":"😤 직접 고함 — 지금 당장 진입해!","en":"Scream at him — this instant!"}',
 '{"ko":"왜 기다리는 거야, 지금 들어가!","en":"Why are you waiting? Move in NOW!"}',
 'vip0_bp4_result_a', 15, '{"control":-2}', NULL, 'cold_blood', '{"jang_taeho":-2}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp4', 1,
 '{"ko":"🎖 뒷거래 — 국방장관직 약속","en":"Back-deal — promise Defense Minister position"}',
 '{"ko":"성공하면 국방장관. 실패하면...","en":"Succeed and you''re Defense Minister. Fail and..."}',
 'vip0_bp4_result_b', 10, '{"control":3}', '{"control":{"min":4}}', 'cold_blood', '{"jang_taeho":1}', FALSE, 0, TRUE, 'control', 4, 'vip0_act2_fail'),

('dlc_vip0', 'vip0_bp4', 2,
 '{"ko":"🕵️ 부사령관에게 라인 만들기","en":"Create a back channel to the deputy commander"}',
 '{"ko":"장태호를 우회한다","en":"Bypass Jang entirely"}',
 'vip0_bp4_result_c', 25, '{"control":1,"intel":2}', NULL, 'conspiring', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp4', 3,
 '{"ko":"😔 수동적 관망 — 장태호는 알아서 하겠지","en":"Passive waiting — let Jang handle it"}',
 '{"ko":"처음으로 의문이 스친다","en":"For the first time, doubt crosses your mind"}',
 'vip0_bp4_result_d', 30, '{"guilt":-1}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP4 결과 → pre_bp5
('dlc_vip0', 'vip0_bp4_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp4_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp4_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp4_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp5 → BP5
('dlc_vip0', 'vip0_pre_bp5', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp5', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP5: 비자금 위기
('dlc_vip0', 'vip0_bp5', 0,
 '{"ko":"🗑️ 디지털 증거 전면 삭제","en":"Wipe all digital evidence"}',
 '{"ko":"계좌 폐쇄. 기록 삭제. 흔적을 지운다.","en":"Close accounts. Delete records. Erase trails."}',
 'vip0_bp5_result_a', 45, '{"control":2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp5', 1,
 '{"ko":"🕵️ 강무현에게 Sentinel 제거 의뢰","en":"Order Kang to destroy Sentinel"}',
 '{"ko":"\"무슨 수를 써서든\" 없애라","en":"\"Whatever it takes\" — eliminate it"}',
 'vip0_bp5_result_b', 15, '{"intel":2}', NULL, 'conspiring', '{"kang_muhyun":2}', TRUE, 120, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp5', 2,
 '{"ko":"🪞 자기합리화 — 국가 자금이라고","en":"Self-justification — it was state funds"}',
 '{"ko":"\"에르메스 17개도?\" \"닥쳐.\"","en":"\"The 17 Hermès bags too?\" \"Shut up.\""}',
 'vip0_bp5_result_c', 10, '{"guilt":3}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp5', 3,
 '{"ko":"🌊 케이맨 제도로 자금 이전","en":"Transfer funds to Cayman Islands"}',
 '{"ko":"혼란 속에서 움직이면 안 보인다","en":"Move during chaos — no one notices"}',
 'vip0_bp5_result_d', 20, '{"control":1}', '{"intel":{"min":3}}', 'cold_blood', NULL, FALSE, 0, TRUE, 'intel', 3, 'vip0_act2_fail'),

-- BP5 결과 → pre_bp6
('dlc_vip0', 'vip0_bp5_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_sub_hayoon', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp5_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_sub_hayoon', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp5_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_sub_hayoon', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp5_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_sub_hayoon', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp6 → BP6
('dlc_vip0', 'vip0_sub_hayoon', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_pre_bp6', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp6', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP6: 딸의 배신
('dlc_vip0', 'vip0_bp6', 0,
 '{"ko":"🔐 딸 강제 확보 — 경호원 투입","en":"Force extraction — deploy security"}',
 '{"ko":"카메라 앞이든 뒤든.","en":"Camera or no camera."}',
 'vip0_bp6_result_a', 20, '{"control":1,"public":-5,"guilt":4}', NULL, 'cold_blood', '{"haeun":-5}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp6', 1,
 '{"ko":"📰 역프레이밍 — 납치당한 불쌍한 아이","en":"Counter-frame — she was kidnapped by protesters"}',
 '{"ko":"딸을 피해자로 만든다","en":"Make her the victim"}',
 'vip0_bp6_result_b', 25, '{"media":1,"public":-3}', '{"media":{"min":2}}', 'pragmatic', NULL, FALSE, 0, TRUE, 'media', 2, 'vip0_choke2'),

('dlc_vip0', 'vip0_bp6', 2,
 '{"ko":"😢 무너짐 — 처음으로 눈물을 흘린다","en":"Collapse — cry for the first time"}',
 '{"ko":"\"...그래. 니 마음대로 해.\"","en":"\"Fine. Do whatever you want.\""}',
 'vip0_bp6_result_c', 10, '{"guilt":3,"control":-2}', NULL, 'humanist', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp6', 3,
 '{"ko":"📞 딸에게 직접 전화 — \"엄마가 틀렸을 수도 있어\"","en":"Call her — \"Mom might be wrong\""}',
 '{"ko":"진심인지, 조작인지, 자신도 모른다","en":"Even you don''t know if it''s sincere"}',
 'vip0_bp6_result_d', 20, '{"guilt":-2,"empathy":4}', NULL, 'humanist', '{"haeun":3}', TRUE, 100, FALSE, NULL, NULL, NULL),

-- BP6 결과 → Choke Point 2
('dlc_vip0', 'vip0_bp6_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp6_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp6_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp6_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_choke2', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ✅ VIP0 ACT 2 시나리오 시드 완료


-- ====== 20260222_seed_vip0_act3.sql ======
-- ═══════════════════════════════════════════
-- 6 Hours — VIP0 ACT 3 시나리오 데이터 시드
-- 붕괴 (04:00~06:00): 3 분기점 + 6 엔딩
-- 시점: 이수연 (The Pinnacle — 세계가 무너지는 중)
-- ═══════════════════════════════════════════

INSERT INTO scenario_nodes (id, scenario_id, act, node_type, content, metadata, conditions, time_cost, stat_changes, morality_tag) VALUES

-- BP7 도입부
('vip0_pre_bp7', 'dlc_vip0', 3, 'story',
 '{"ko":"시간: 02:00:00 남음\n\n상황실의 모니터가 하나둘 꺼지고 있다.\n\n모니터 1: Grand Assembly — 의원 수 134. 정족수까지 17명.\n모니터 2: Liberty Square — 수만 명. 촛불의 바다.\n모니터 3: 군 — 장교 일부가 명령 불복종.\n모니터 4: 국제 — EU, UN 성명 발표.\n\n그리고 모니터 5.\n딸 이하은이 촛불을 들고 서 있다.\n\n남편 이재민이 서재에서 나온다.\n눈이 충혈되어 있다.\n54세의 얼굴에 주름이 깊어졌다.\n\n\"수연아... 뭘 한 거야, 우리가.\"\n\n이수연은 대답하지 않는다.\n하지만 손이 떨리고 있다.","en":"2 hours left. Assembly: 134 lawmakers. 17 short of quorum. Officers defecting. Your husband Lee Jaemin emerges — the man''s face aged a decade tonight: \"What did we do?\" Your hands are trembling."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP7: 최후의 도박
('vip0_bp7', 'dlc_vip0', 3, 'branch_main',
 '{"ko":"정족수까지 17명.\n군이 흔들리고 있다.\n남편이 무너지고 있다.\n딸이 적 편에 서 있다.\n\n마지막 카드를 쓸 시간이다.\n\n이수연, 어떻게 하겠는가?","en":"17 lawmakers short. Military wavering. Husband breaking. Daughter on the other side. Time for your last card. What will you do, Suyeon?"}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP7 결과
('vip0_bp7_result_a', 'dlc_vip0', 3, 'story',
 '{"ko":"남편의 서명을 위조한다.\n\n\"사임서... 이건 인쇄체잖아.\"\n\n비서관이 당황한다.\n\n\"닥쳐. 남편은 판단 능력이 없어.\n내가 대리 서명한다.\n국방장관에게 전달해.\n''대통령이 전권을 군에 위임한다.'' \"\n\n헌법에 없는 권한 이양.\n하지만 이수연은 멈추지 않는다.\n\n[위조 사임서 — 군에 전권 위임. 위헌의 위헌.]","en":"You forge the president''s signature on a power transfer document. \"The president delegates full authority to the military.\" Unconstitutional squared."}',
 '{}', NULL, 20, '{"control":2,"guilt":4}', 'cold_blood'),

('vip0_bp7_result_b', 'dlc_vip0', 3, 'story',
 '{"ko":"이수연이 직접 군 지휘 채널에 접속한다.\n\n\"장태호! 내가 직접 명령한다!\n의회에 진입해! 지금 당장!\"\n\n장태호의 목소리: \"VIP0, 당신은 지휘 계통에 없습니다.\n저는 대통령의 명령만—\"\n\n\"대통령은 내가 관리한다고 했잖아!\"\n\n\"...VIP0, 진정하십시오.\"\n\n전화가 끊긴다.\n\n이수연이 소리를 지른다.\n주변의 모든 것이 흔들리고 있다.\n\n[직접 지휘 실패 — 모든 통제력 상실]","en":"You try to command the military directly. Jang: \"You are not in the chain of command.\" The call ends. You scream. Everything is slipping."}',
 '{}', NULL, 15, '{"control":-4}', 'cold_blood'),

('vip0_bp7_result_c', 'dlc_vip0', 3, 'story',
 '{"ko":"외국 대사에게 전화한다.\n\n\"대사님, 긴급 상황입니다.\n남편과 저... 보호가 필요합니다.\n정치적 망명 가능합니까?\"\n\n대사관 측의 대답:\n\"...조건이 있습니다, VIP0.\n대통령이 직접 계엄 해제를 선언해야 합니다.\n그래야 우리 정부가 보호할 명분이 생깁니다.\"\n\n계엄을 해제하면 모든 죄가 드러난다.\n해제하지 않으면 망명도 불가.\n\n진퇴양난.\n\n[망명 협상 — 계엄 해제가 전제 조건]","en":"You call a foreign embassy: \"We need protection.\" \"The president must lift martial law first.\" Lift it and your crimes are exposed. Don''t and there''s no asylum."}',
 '{}', NULL, 25, '{"control":-1}', 'pragmatic'),

('vip0_bp7_result_d', 'dlc_vip0', 3, 'story',
 '{"ko":"이수연이 금고 앞에 선다.\n\n비자금 문서. 이중 서명 원본. 부패의 모든 증거.\n\n성냥을 켠다.\n\n\"...전부 태워.\"\n\n문서가 불타기 시작한다.\n10년간의 비밀이 재가 된다.\n\n하지만 연기가 감지기에 닿는다.\n화재 경보가 울린다.\n\n\"VIP0, 화재 경보입니다!\"\n\n이수연이 불길 앞에 서 있다.\n거울처럼 불꽃에 비친 자신의 얼굴.\n\n[증거 소각 — 물리적 증거 파기, 하지만 소동]","en":"You stand before the safe. Ten years of secrets, bribery records, dual signatures. A match. Documents burn. But the fire alarm triggers."}',
 '{}', NULL, 15, '{"control":1,"guilt":2}', 'cold_blood'),

-- BP8 도입부: 딸과의 대면
('vip0_pre_bp8', 'dlc_vip0', 3, 'story',
 '{"ko":"시간: 01:00:00 남음\n\n관저 1층 로비.\n경호원들이 웅성거린다.\n\n\"VIP0, 이하은 양이... 관저에 왔습니다.\"\n\n\"뭐?\"\n\n\"혼자 왔습니다. 정문으로.\n경호원들이 막으려 했지만...\n''엄마한테 할 말이 있다''고 했습니다.\"\n\n이수연의 심장이 멈추는 것 같다.\n\n딸이... 직접 왔다.","en":"\"Haeun is here. She came alone through the front gate.'' ''She said she needs to talk to you.'' Your heart stops."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP8: 딸과의 대면
('vip0_bp8', 'dlc_vip0', 3, 'branch_main',
 '{"ko":"딸이 관저에 직접 왔다.\n\n6시간 동안 모든 것을 통제하려 했던 이수연.\n하지만 이 아이 앞에서는...\n\n거짓말을 할 것인가.\n진실을 말할 것인가.\n이용할 것인가.\n용서를 구할 것인가.","en":"Your daughter came to The Pinnacle. All night you controlled everything. But in front of this child... Will you lie, confess, use her, or beg forgiveness?"}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP8 결과
('vip0_bp8_result_a', 'dlc_vip0', 3, 'story',
 '{"ko":"\"하은아, 네가 와줬구나.\"\n\n포옹하려 하지만, 딸이 한 걸음 물러선다.\n\n\"엄마... 나는 엄마 딸이야.\n근데 나도 이 나라 국민이야.\"\n\n\"그래, 알아. 그리고 넌 내 편이어야 해.\"\n\n\"...엄마 편이 아니라 옳은 편이어야 해.\"\n\n침묵.\n\n\"하은아. 네가 방송에 나가서 아버지를 지지한다고 말해줘.\n그러면 엄마가...\"\n\n\"엄마가 뭘 줄 건데? 또 카드? 유학?\"\n\n딸의 눈빛이 차갑다.\n\n[딸을 이용 시도 — 끝까지 조작. 관계 파괴.]","en":"\"Be on my side.\" \"I should be on the right side, not your side.\" You try to use her for a broadcast. Her eyes go cold."}',
 '{}', NULL, 15, '{"control":1,"guilt":5}', 'cold_blood'),

('vip0_bp8_result_b', 'dlc_vip0', 3, 'story',
 '{"ko":"이수연이 소파에 주저앉는다.\n\n\"...하은아.\"\n\n딸이 맞은편에 앉는다.\n\n\"엄마가 틀렸어.\"\n\n9글자.\n52년 인생에서 한 번도 하지 않았던 말.\n\n\"이 계엄... 엄마가 시킨 거야.\n아빠는 서명만 했어.\n다... 엄마가 한 거야.\"\n\n딸의 눈에 눈물이 고인다.\n\n\"알고 있었어, 엄마. 다 알고 있었어.\"\n\n이수연이 울기 시작한다.\n태어나서 두 번째로.\n첫 번째는 이 아이를 낳았을 때.\n\n[진심 고백 — 52년 만에 처음으로 ''틀렸다''고 말하다]","en":"\"Haeun. Mom was wrong.\" Nine syllables. Words you never said in 52 years. \"I ordered the martial law. Dad just signed.\" Your daughter''s tears: \"I knew, Mom. I always knew.\""}',
 '{}', NULL, 20, '{"guilt":-5,"empathy":6}', 'humanist'),

('vip0_bp8_result_c', 'dlc_vip0', 3, 'story',
 '{"ko":"\"넌 날 이해 못 해.\"\n\n이수연이 차갑게 말한다.\n\n\"넌 태어나서 한 번도 배고파본 적 없잖아.\n가난이 뭔지 모르잖아.\n엄마가 이 자리에 오기까지 얼마나...\"\n\n\"그래서 남의 나라를 망쳐도 되는 거야?!\"\n\n\"이 나라? 이 나라는 내가 만들었어!\"\n\n딸이 일어선다.\n\"...엄마, 이 나라는 엄마 거 아니야.\"\n\n문이 닫힌다.\n\n이수연이 빈 방에 혼자 남는다.\n\n[거부 — 마지막 기회 상실. 딸 영구 이탈.]","en":"\"You don''t understand poverty.\" \"So it''s okay to destroy a country?!\" \"This country? I MADE this country!\" \"No, Mom. This country isn''t yours.\" The door closes. You''re alone."}',
 '{}', NULL, 10, '{"control":-1,"guilt":3}', 'cold_blood'),

('vip0_bp8_result_d', 'dlc_vip0', 3, 'story',
 '{"ko":"이수연이 딸을 보고,\n딸이 어머니를 본다.\n\n아무 말도 하지 않는다.\n\n1분.\n2분.\n3분.\n\n바깥에서 장갑차 소리가 들린다.\n\n이하은이 먼저 말한다.\n\"엄마, 같이 나가.\"\n\n\"어디로?\"\n\n\"광장으로. 사람들 앞으로.\n엄마가 직접 말해. 끝내자고.\"\n\n이수연의 입술이 떨린다.\n\n\"...같이?\"\n\n\"같이.\"\n\n[딸과 함께 광장으로 — 각성 엔딩 루트]","en":"Three minutes of silence. Haeun speaks: \"Mom, come with me. To the square. Tell everyone yourself. End this.\" Your lips tremble. \"Together?\" \"Together.\""}',
 '{}', NULL, 5, '{"empathy":5,"guilt":-3}', 'humanist'),

-- BP9 도입부: 최종 결단
('vip0_pre_bp9', 'dlc_vip0', 3, 'story',
 '{"ko":"시간: 00:30:00 남음\n\n이수연이 관저 창문 밖을 본다.\n\nCentris의 밤하늘.\n왼쪽: 촛불의 바다.\n오른쪽: 장갑차의 불빛.\n\n가운데: Grand Assembly.\n한세진이 투표를 준비하고 있다.\n\n이수연이 거울을 본다.\n마지막으로.\n\n\"...끝이 보인다.\"\n\n30분.\n마지막 30분.","en":"30 minutes left. Suyeon looks through the window: candles on the left, tanks on the right, Grand Assembly in the middle. She looks at the mirror one last time."}',
 '{}', NULL, 5, NULL, NULL),

-- 분기점 V-BP9: 최종 결단
('vip0_bp9', 'dlc_vip0', 3, 'branch_main',
 '{"ko":"30분.\n\n이수연의 마지막 선택.\n\n왕좌를 지킬 것인가.\n왕좌에서 내려올 것인가.\n왕좌를 버리고 도망칠 것인가.\n아니면... 다른 길이 있는가.","en":"30 minutes. Your final choice. Hold the throne. Step down. Flee. Or... is there another way?"}',
 '{}', NULL, 5, NULL, NULL),

-- V-BP9 → 직접 엔딩 연결이므로 결과 노드 = 엔딩

-- ════════════ VIP0 6개 엔딩 ════════════

-- V-E1: 황금 새장 (True Bad)
('vip0_ending_e1', 'dlc_vip0', 3, 'ending',
 '{"ko":"이수연이 관저를 사수한다.\n\n경호원들을 배치하고, 금고를 잠그고,\n남편을 다시 재운다.\n\n밖에서 표결이 시작된다.\n하지만 이수연은 듣지 않는다.\n\n전화가 울린다.\n\"VIP0, 정족수에 도달했습니다.\n계엄이 해제되었습니다.\"\n\n이수연이 전화를 내려놓는다.\n\n\"...그래. 끝났구나.\"\n\n하지만 경찰이 오지 않는다.\n강무현이 미리 빼놓은 빠져나갈 구멍.\n\n3개월 후.\nDubai의 펜트하우스.\n이수연이 바다를 바라본다.\n\n돈은 있다. 자유도 있다.\n하지만 딸은 전화를 받지 않는다.\n\n\"하은아... 전화 좀 받아.\"\n\n번호가 차단되어 있다.\n\n황금 새장.\n\n— You won everything. You lost the only thing that mattered. —","en":"You hold The Pinnacle. Escape through Kang''s back channel. 3 months later: Dubai penthouse. Money. Freedom. But Haeun''s number is blocked. You won everything. You lost the only thing that mattered."}',
 '{"title":{"ko":"황금 새장","en":"The Golden Cage"},"grade":"true_bad","reward_credits":300,"unlock_title":"special"}',
 '{"maintained_control":true,"haeun_relationship":"broken"}', 0, NULL, NULL),

-- V-E2: 체포 (Bad)
('vip0_ending_e2', 'dlc_vip0', 3, 'ending',
 '{"ko":"계엄이 해제된다.\n\n30분 후, 관저에 검찰이 도착한다.\n\n\"이수연 씨, 내란 교사 혐의로 체포합니다.\"\n\n이수연이 소리친다.\n\"나는 이 나라의 퍼스트레이디야!\n감히 누가...\"\n\n수갑이 채워진다.\n\n카메라 플래시가 터진다.\n이수연의 무너진 화장이 전 세계에 중계된다.\n\n6개월 후. 법정.\n판사: \"피고인 이수연, 내란 교사 및 뇌물수수 혐의로\n무기징역을 선고합니다.\"\n\n이수연이 방탄유리 너머를 본다.\n방청석에 딸은 없다.\n\n— The law doesn''t care who you were. —","en":"Martial law lifted. Prosecutors arrive. \"You''re under arrest for inciting insurrection.\" Cameras flash on your ruined makeup. 6 months later: life sentence. Haeun is not in the courtroom."}',
 '{"title":{"ko":"체포","en":"Arrested"},"grade":"bad","reward_credits":100,"rogue_unlock":"first_lady_secrets"}',
 '{"evidence_remained":true}', 0, NULL, NULL),

-- V-E3: 망명 (Neutral Bad)
('vip0_ending_e3', 'dlc_vip0', 3, 'ending',
 '{"ko":"대사관 차량이 지하 주차장에 대기 중이다.\n\n이수연이 남편의 손을 잡는다.\n\"가자.\"\n\n이재민이 고개를 흔든다.\n\"나는... 남을게.\"\n\n\"뭐?\"\n\n\"내가 서명했잖아. 내가 책임져야지.\"\n\n처음으로, 이 남자가 대통령답다.\n남자의 결단력이 한순간 돌아왔다.\n\n이수연이 혼자 차에 오른다.\n\n공항으로 가는 길.\nCentris의 불빛이 멀어진다.\nLiberty Square의 촛불이 작아진다.\n\n라디오에서 뉴스가 흘러나온다.\n\"계엄이 해제되었습니다...\"\n\n이수연이 뒷자석에서 울고 있다.\n\n6개월 후.\n방콕의 저렴한 콘도.\n돈은 동결되었다.\n\n\"매일 같은 생각을 해.\n돌아갈 수 있다면...\"\n\n(돌아갈 곳은 없다.)\n\n— You ran. You''re still running. —","en":"The embassy car waits. Jaemin stays: \"I signed it. I''ll take responsibility.\" His resolve returns — for the first time, he''s truly presidential. You flee alone. Bangkok, 6 months later. Frozen assets. Cheap condo."}',
 '{"title":{"ko":"망명","en":"Exile"},"grade":"neutral_bad","reward_credits":150}',
 '{"chose_exile":true}', 0, NULL, NULL),

-- V-E4: 고백 (Neutral Good)
('vip0_ending_e4', 'dlc_vip0', 3, 'ending',
 '{"ko":"이수연이 관저 앞에 선다.\n카메라 앞에.\n\n\"저는... 이수연입니다.\n대통령의 아내이고,\n오늘 밤 이 모든 일의...\n진짜 원인입니다.\"\n\n숨을 들이킨다.\n\n\"Directive 6는 제가 지시했습니다.\n이재민은... 서명만 했습니다.\n비자금과 해외 계좌도... 제 것입니다.\n\n저는... 법 앞에 서겠습니다.\"\n\n침묵.\n그리고 카메라 뒤에서 누군가 박수를 친다.\n이하은이다.\n\n눈물을 흘리면서.\n\n1년 후. 교도소 면회실.\n이하은이 유리 너머에 앉아 있다.\n\n\"엄마, 오늘 대학 합격했어.\"\n\n\"...정말?\"\n\n\"법학과.\"\n\n이수연이 웃는다.\n교도소에서 처음으로.\n\n— Some prisons are freer than palaces. —","en":"You stand before cameras: \"I ordered Directive 6. Jaemin only signed. The accounts are mine. I will face the law.\" Silence. Then applause from behind the camera — Haeun, crying. 1 year later, prison visitation: \"Mom, I got into law school.\" You smile for the first time."}',
 '{"title":{"ko":"고백","en":"Confession"},"grade":"neutral_good","reward_credits":350,"achievement":"broken_crown","unlock_title":"rare"}',
 '{"confessed":true,"haeun_relationship":"reconciled"}', 0, NULL, NULL),

-- V-E5: 각성 (Good)
('vip0_ending_e5', 'dlc_vip0', 3, 'ending',
 '{"ko":"이수연이 이재민을 깨운다.\n\n\"여보, 일어나.\"\n\n\"...뭐야?\"\n\n\"계엄 해제해.\"\n\n\"뭐?!\"\n\n\"우리가 틀렸어.\n지금 해제하면 아직 늦지 않아.\"\n\n남편의 눈이 커진다.\n\n\"...수연아, 정말이야?\"\n\n\"응. 끝내자. 이 미친 짓.\"\n\n대통령의 서명.\n이번에는, 올바른 문서에.\n\n[계엄 해제]\n\nGrand Assembly에서 환호가 터져 나온다.\n한세진이 투표 결과를 보다가...\n\"...대통령이 먼저 해제했다고?\"\n\n이수연이 관저 창문에서 본다.\nLiberty Square의 촛불이 환호로 바뀐다.\n\n이하은에게서 문자가 온다.\n\"엄마, 고마워.\"\n\n이수연이 웃는다.\n52년 만에 처음으로, 진짜 웃음.\n\n(이후 법적 절차는 피할 수 없다.\n하지만 감형은 있을 것이다.\n그리고 딸이 있을 것이다.)\n\n— It''s never too late to do the right thing. —","en":"You wake Jaemin: \"Lift it. We were wrong.\" This time, the right document. Grand Assembly erupts. From the window, candles become cheers. Haeun texts: \"Thank you, Mom.\" Your first real smile in 52 years."}',
 '{"title":{"ko":"각성","en":"Awakening"},"grade":"good","reward_credits":500,"achievement":"redemption_arc","unlock_title":"legendary"}',
 '{"lifted_martial_law":true,"haeun_relationship":"reconciled"}', 0, NULL, NULL),

-- V-E6: Sentinel (Hidden)
('vip0_ending_e6', 'dlc_vip0', 3, 'ending',
 '{"ko":"━━━ HIDDEN ENDING: THE PUPPET ━━━\n\n강무현이 관저에 나타난다.\n\n\"VIP0, 아니... 수연 씨.\n지금까지 수고 많으셨습니다.\"\n\n\"...뭐야, 이 시간에?\"\n\n강무현이 미소 짓는다.\n그 미소가... 처음 보는 종류다.\n\n하지만 그의 눈이 잠깐 먼 곳을 향한다.\n마치... 자기 위에 또 누군가가 있다는 듯.\n\n\"Sentinel 말입니다.\n제가 만들었습니다.\"\n\n\"...뭐?\"\n\n\"비자금 추적, 이중 서명 유출,\n의회 내부 정보 유통.\n전부 제가 설계한 겁니다.\"\n\n이수연의 눈이 커진다.\n\n\"왜...?\"\n\n\"대통령도 꼭두각시.\n당신도 꼭두각시.\n장태호도.\n한세진조차도.\n\n모두 제 체스판 위의 말이었습니다.\n\n...라고 말하고 싶지만,\n사실 저도 누군가의 말이었습니다.\n선생님의.\"\n\n\"선생님은... 78살이야.\n30년 전에 은퇴한 사람이\n아직 3개 채널을 동시에 보고 있어.\n정보사 OB 네트워크 —\n현역보다 빠른 퇴역군인들의 그림자.\n\n그분이 만든 체스판은...\n이 나라만이 아니야.\"\n\n\"네가... 뭘 원하는 거야?\"\n\n강무현이 창 밖을 본다.\nCentris의 새벽.\n\n\"새로운 나라요.\n부패한 왕과 왕비가 없는.\n진짜 공화국.\"\n\n\"...미쳤어.\"\n\n\"미쳤죠. 하지만 성공했습니다.\"\n\n모니터에 뉴스가 뜬다.\n\"긴급: 대통령 부부의 비자금 전액 공개.\n이중 서명 원본 확인.\n계엄 해제. 대통령 자진 사퇴.\"\n\n이수연이 주저앉는다.\n\n\"다음 6시간은...\n당신이 법정에 서는 시간입니다.\"\n\n강무현이 돌아선다.\n\n\"[TO BE CONTINUED]\"\n\n━ 3개월 후. Centris 교외 안전가옥. ━\nTV 3대가 꺼져 있다.\n의자는 아직 따뜻하다.\n\n그러나 아무도 없다.\n\n테이블 위에 메모 한 장:\n\"체스판을 넓혀야 할 때가 왔다.\"\n\n━━━━━━━━━━━━━━━━━━━━━━━","en":"SENTINEL. Kang Muhyun arrives: \"I created Sentinel. The president, you, Jang, even Han Sejin — all pieces on my chessboard. I wanted a real republic. Without corrupt kings and queens.\" But my teacher — 78, retired 30 years ago — still monitors three channels. His chessboard extends beyond this country.\" Everything is exposed. \"The next six hours... are when you face the court.\" 3 months later: a safehouse. Three TVs off, chair still warm. A note: Time to expand the chessboard."}',
 '{"title":{"ko":"꼭두각시","en":"The Puppet"},"grade":"hidden","reward_credits":1000,"achievement":"puppet_master","unlock_title":"legendary","teaser":"season2"}',
 '{"sentinel_complete":true,"kang_muhyun_high":true}', 0, NULL, NULL)

ON CONFLICT (scenario_id, id) DO NOTHING;

-- ── VIP0 ACT 3 선택지 ──

INSERT INTO node_choices (scenario_id, node_id, choice_index, label, description, target_node, time_cost, stat_changes, stat_requirements, morality_tag, relationship_changes, is_premium, premium_cost, has_check, check_stat, check_min, fail_node) VALUES

-- Choke2 → pre_bp7
('dlc_vip0', 'vip0_choke2', 0, '{"ko":"Act 3로 진행","en":"Proceed to Act 3"}', '{"ko":"","en":""}', 'vip0_pre_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp7 → BP7
('dlc_vip0', 'vip0_pre_bp7', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp7', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP7: 최후의 도박
('dlc_vip0', 'vip0_bp7', 0,
 '{"ko":"📝 위조 사임서 — 군에 전권 위임","en":"Forge resignation — transfer all power to military"}',
 '{"ko":"남편의 서명을 위조한다","en":"Forge the president''s signature"}',
 'vip0_bp7_result_a', 20, '{"control":2,"guilt":4}', '{"control":{"min":5}}', 'cold_blood', NULL, FALSE, 0, TRUE, 'control', 5, 'vip0_ending_e2'),

('dlc_vip0', 'vip0_bp7', 1,
 '{"ko":"📡 직접 군 지휘 시도","en":"Try to command the military directly"}',
 '{"ko":"장태호를 우회해서 장교들에게 직접","en":"Bypass Jang — go directly to officers"}',
 'vip0_bp7_result_b', 15, '{"control":-4}', NULL, 'cold_blood', '{"jang_taeho":-3}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp7', 2,
 '{"ko":"🏛️ 대사관에 망명 요청","en":"Request asylum at an embassy"}',
 '{"ko":"남편과 나... 보호가 필요하다","en":"We need protection"}',
 'vip0_bp7_result_c', 25, '{"control":-1}', NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp7', 3,
 '{"ko":"🔥 모든 증거 소각","en":"Burn all evidence"}',
 '{"ko":"금고의 문서를 전부 태운다","en":"Every document in the safe goes up in flames"}',
 'vip0_bp7_result_d', 15, '{"control":1,"guilt":2}', NULL, 'cold_blood', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- BP7 결과 → pre_bp8
('dlc_vip0', 'vip0_bp7_result_a', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp7_result_b', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp7_result_c', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp7_result_d', 0, '{"ko":"다음으로","en":"Continue"}', '{"ko":"","en":""}', 'vip0_pre_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp8 → BP8
('dlc_vip0', 'vip0_pre_bp8', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_bp8', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP8: 딸과의 대면
('dlc_vip0', 'vip0_bp8', 0,
 '{"ko":"🎭 딸을 이용 — 방송에 아버지 지지 발언 시키기","en":"Use her — make her support the president on TV"}',
 '{"ko":"\"넌 내 편이어야 해\"","en":"\"You should be on my side\""}',
 'vip0_bp8_result_a', 15, '{"control":1,"guilt":5}', NULL, 'cold_blood', '{"haeun":-5}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp8', 1,
 '{"ko":"😢 진심 고백 — \"엄마가 틀렸어\"","en":"True confession — \"Mom was wrong\""}',
 '{"ko":"52년 인생에서 한 번도 하지 않았던 말","en":"Words you''ve never said in 52 years"}',
 'vip0_bp8_result_b', 20, '{"guilt":-5,"empathy":6}', NULL, 'humanist', '{"haeun":5}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp8', 2,
 '{"ko":"❄️ 거부 — \"넌 날 이해 못 해\"","en":"Rejection — \"You don''t understand me\""}',
 '{"ko":"가난을 모르는 네가 뭘 알아","en":"You''ve never known poverty"}',
 'vip0_bp8_result_c', 10, '{"control":-1,"guilt":3}', NULL, 'cold_blood', '{"haeun":-4}', FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp8', 3,
 '{"ko":"🕊️ 함께 광장으로 — 직접 끝내자","en":"Go to the square together — end it ourselves"}',
 '{"ko":"\"같이?\" \"같이.\"","en":"\"Together?\" \"Together.\""}',
 'vip0_bp8_result_d', 5, '{"empathy":5,"guilt":-3}', '{"empathy":{"min":4}}', 'humanist', '{"haeun":5}', TRUE, 150, TRUE, 'empathy', 4, 'vip0_pre_bp9'),

-- BP8 결과 → pre_bp9
('dlc_vip0', 'vip0_bp8_result_a', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp8_result_b', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp8_result_c', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),
('dlc_vip0', 'vip0_bp8_result_d', 0, '{"ko":"계속...","en":"Continue..."}', '{"ko":"","en":""}', 'vip0_pre_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- pre_bp9 → BP9
('dlc_vip0', 'vip0_pre_bp9', 0, '{"ko":"마지막 30분...","en":"The final 30 minutes..."}', '{"ko":"","en":""}', 'vip0_bp9', 0, NULL, NULL, NULL, NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

-- V-BP9: 최종 결단 → 엔딩 분기
('dlc_vip0', 'vip0_bp9', 0,
 '{"ko":"👑 관저 사수 — 끝까지 권력을 잡는다","en":"Hold the throne — grip power to the end"}',
 '{"ko":"이 자리는 내 거야","en":"This seat is mine"}',
 'vip0_ending_e1', 0, NULL, '{"control":{"min":6}}', 'cold_blood', NULL, FALSE, 0, TRUE, 'control', 6, 'vip0_ending_e2'),

('dlc_vip0', 'vip0_bp9', 1,
 '{"ko":"✈️ 남편과 함께 망명","en":"Flee with your husband"}',
 '{"ko":"살아남아야 싸운다","en":"You must survive to fight"}',
 'vip0_ending_e3', 0, NULL, NULL, 'pragmatic', NULL, FALSE, 0, FALSE, NULL, NULL, NULL),

('dlc_vip0', 'vip0_bp9', 2,
 '{"ko":"🎤 공개 자수 — 법 앞에 선다","en":"Public surrender — face the law"}',
 '{"ko":"이 모든 일의 원인은 나다","en":"I caused all of this"}',
 'vip0_ending_e4', 0, NULL, '{"guilt":{"min":3}}', 'humanist', '{"haeun":3}', FALSE, 0, TRUE, 'guilt', 3, 'vip0_ending_e2'),

('dlc_vip0', 'vip0_bp9', 3,
 '{"ko":"💡 남편을 깨워 계엄 해제시킨다","en":"Wake your husband — make him lift martial law"}',
 '{"ko":"\"끝내자. 이 미친 짓.\"","en":"\"End this. This madness.\""}',
 'vip0_ending_e5', 0, NULL, '{"empathy":{"min":5}}', 'humanist', '{"haeun":5}', FALSE, 0, TRUE, 'empathy', 5, 'vip0_ending_e4'),

-- 히든 엔딩 루트 (강무현 관계 충분 시)
('dlc_vip0', 'vip0_bp9', 4,
 '{"ko":"🕵️ 강무현을 부른다 — 마지막 거래","en":"Call Kang Muhyun — one last deal"}',
 '{"ko":"\"네가 뭘 숨기고 있는지 알아\"","en":"\"I know what you''re hiding\""}',
 'vip0_ending_e6', 0, NULL, NULL, 'conspiring', '{"kang_muhyun":3}', TRUE, 200, FALSE, NULL, NULL, NULL)

ON CONFLICT DO NOTHING;

-- ── VIP0 엔딩 메타데이터 ──

INSERT INTO endings (id, scenario_id, title, description, grade, conditions, rewards) VALUES
('vip0_ending_e1', 'dlc_vip0',
 '{"ko":"황금 새장","en":"The Golden Cage"}',
 '{"ko":"돈과 자유를 얻었다. 하지만 딸을 잃었다.","en":"Money and freedom. But your daughter is gone."}',
 'true_bad',
 '{"maintained_control":true,"haeun_relationship":"broken"}',
 '{"credits":300,"title":"special"}'),

('vip0_ending_e2', 'dlc_vip0',
 '{"ko":"체포","en":"Arrested"}',
 '{"ko":"퍼스트레이디에서 수인번호로.","en":"From First Lady to inmate number."}',
 'bad',
 '{"evidence_remained":true}',
 '{"credits":100,"rogue_unlock":"first_lady_secrets"}'),

('vip0_ending_e3', 'dlc_vip0',
 '{"ko":"망명","en":"Exile"}',
 '{"ko":"도망쳤다. 아직도 도망치고 있다.","en":"You ran. You''re still running."}',
 'neutral_bad',
 '{"chose_exile":true}',
 '{"credits":150}'),

('vip0_ending_e4', 'dlc_vip0',
 '{"ko":"고백","en":"Confession"}',
 '{"ko":"감옥이 관저보다 자유롭다.","en":"Some prisons are freer than palaces."}',
 'neutral_good',
 '{"confessed":true,"haeun_relationship":"reconciled"}',
 '{"credits":350,"achievement":"broken_crown","title":"rare"}'),

('vip0_ending_e5', 'dlc_vip0',
 '{"ko":"각성","en":"Awakening"}',
 '{"ko":"끝내자. 이 미친 짓. 52년 만의 진짜 웃음.","en":"End this madness. Your first real smile in 52 years."}',
 'good',
 '{"lifted_martial_law":true,"haeun_relationship":"reconciled"}',
 '{"credits":500,"achievement":"redemption_arc","title":"legendary"}'),

('vip0_ending_e6', 'dlc_vip0',
 '{"ko":"꼭두각시","en":"The Puppet"}',
 '{"ko":"모두 체스판 위의 말이었다. 시즌 2로 이어진다.","en":"Everyone was a piece on the chessboard. To be continued."}',
 'hidden',
 '{"sentinel_complete":true,"kang_muhyun_high":true}',
 '{"credits":1000,"achievement":"puppet_master","title":"legendary","teaser":"season2"}')

ON CONFLICT DO NOTHING;

-- ✅ VIP0 ACT 3 + 6 엔딩 시나리오 시드 완료

