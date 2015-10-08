'use strict';
var yargs = require('yargs');
var argv = yargs.alias('c', 'smartcode').string('smartcode').argv;
var smartcode = argv.smartcode;

if (smartcode.length < 19) {
    console.error('wrong smart code');
    process.exit(1);
}

var nightmare = require('nightmare')({ show: true });
var vo = require('vo');

vo(run)(function(err, result) {
    if (err) throw err;
});

function *run() {
    var result = yield nightmare
        .goto('http://kfckoreasurvey.com')
        .wait('#NextButton')
        .click('#NextButton')
        .wait('#InputCouponNum') // 설문조사 초대장에 인쇄된 숫자를 입력해 주십시오
        .type('input[title="InputCouponNum"]', smartcode)
        .click('#NextButton')
        .wait('#FNSR001000') // 주문 유형을 선택하십시오
        .click('.Opt2 input') // 포장
        .click('#NextButton')
        .wait('#FNSR002000') // 어떤 방법으로 주문하셨습니까?
        .click('.Opt6 input') // 카운터
        .click('#NextButton')
        .wait('#FNSR004000') // KFC에서 겪은 귀하의 경험에 대해 전반적인 만족도를 평가해주십시오.
        .click('.Opt4 input') // 만족
        .click('#NextButton')
        .wait('#FNSBlock300') // 다음의 각 부문별로 귀하의 만족도를 평가해주십시오.
        .click('#FNSR013000 .Opt4 input') // 서비스 속도 - 만족
        .click('#FNSR020000 .Opt4 input') // 직원의 친절함 - 만족
        .click('#FNSR024000 .Opt4 input') // 레스토랑의 청결함 - 만족
        .click('#FNSR007000 .Opt4 input') // 음식의 맛 - 만족
        .click('#FNSR009000 .Opt4 input') // 주문 정확도 - 만족
        .click('#FNSR032000 .Opt4 input') // 지불한 금액 대비 전반적 가치 - 만족
        .click('#NextButton')
        .wait('#FNSR033000') // 방문하셨을 때 어떠한 문제가 있었습니까?
        .click('.Opt2 input') // 아니요
        .click('#NextButton')
        .wait('#FNSBlock1800') // 이용해 보신 결과, 귀하의 다음 번 예상 행동에 대하여…
        .click('#FNSR036000 .Opt3 input') // 향후 30일 이내에 다른 이들에게 이 KFC을(를) 추천하시겠습니까? - 보통
        .click('#FNSR035000 .Opt3 input') // 향후 30일 내에 KFC을(를) 다시 찾으시겠습니까? - 보통
        .click('#NextButton')
        .wait('#FNSS080000') // 귀하가 이 KFC 레스토랑에서의 경험에 매우 만족하지 못한 이유를 말씀해주십시오. 가능한 한 구체적으로 답변해주시기 바랍니다.
        // 노답
        .click('#NextButton')
        .wait('#FNSR040000') // KFC의 방문 계기는 다음 중 무엇입니까?
        .click('.Opt2 input') // 쿠폰을 사용하려고
        .click('#NextButton')
        .wait('#FNSR000017') // 맥도널드와 비교해서 KFC의 음식은 어떻다고 생각하십니까?
        .click('.Opt4 input') // 다소 좋음
        .click('#NextButton')
        .wait('#FNSR003000') // 직원이 본 설문조사에 대해 알려주었습니까?
        .click('.Opt2 input') // 아니요
        .click('#NextButton')
        .wait('#FNSR048000') // KFC의 프로모션, 새 소식 또는 특별 할인과 관련하여 정기적인 이메일이나 우편물을 구독할 의향이 있습니까?
        .click('.Opt2 input') // 아니요
        .click('#NextButton')
        .wait('#finishIncentiveHolder') // 설문조사 초대장에 인쇄된 다음 스마트 코드를 입력해 주십시오.
        .evaluate(function () {
            return document.querySelector('.ValCode').textContent.trim();
        });
    console.log(result);
    yield nightmare.end();
}
