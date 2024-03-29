import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

it('className prop으로 설정한 css class가 적용된다.', async () => {
  // 1️⃣ Arrange : 테스트를 위한 환경 만들기
  // => className을 지닌 컴포넌트 렌더링
  // 2️⃣ Act : 테스트할 동작 발생
  // => 랜더링에 대한 검증이기 때문에 이 단계는 현재 생략
  // => 클릭, 메서드 호출 , props 변경 등이 이에 해당
  // 3️⃣ Asset : 올바른 동작이 실행되었는지 검증
  // => 랜더링 후 DOM에 해당 class가 존재하는지 검증

  // render API를 호출 => 테스트 환경의 jsDOM 리액트 컴포넌트가 랜더링된 DOM 구조가 반영됨.
  // jsDOM : Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현한 것

  // my-class 라는 className이 제대로 랜더되는가...!
  await render(<TextField className="my-class" />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // jsdom에서 html dom 구조를 확인해볼 수 있음
  screen.debug();

  // vitest의 expect 함수를 사용하여 기대 결과를 검증
  // ✅ className이란 내부 prop이나 state 값을 검증 (x)
  // ✅ 랜더링되는 DOM 구조가 올바르게 변경되었는지 확인 (o) => 최종적으로 사용자가 보는 결과는 DOM
  expect(textInput).toHaveClass('my-class');
});

describe('group', () => {
  // 원하는 테스트들을 그룹핑하여 독립된 context내에서 테스트를 진행할 수 있게 함.
  // it은 기본적으로 전역 context를 가짐
  // someFun은 이 describe 블록 내에서만 유효하다.
  function someFun() {}

  it('className prop으로 설정한 css class가 적용된다.', async () => {
    await render(<TextField className="my-class" />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    screen.debug();

    expect(textInput).toHaveClass('my-class');
  });
});

describe('placeholder', () => {
  it('기본 placeholder "텍스트를 입력해 주세요." 가 노출된다.', async () => {
    // it 함수 내에서는 기대 결과를 검증하는 코드를 작성한다.
    // 기대결좌 === 실제 결과 => 성공
    // 기대결과 !== 실제 결과 -> 실패

    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    // 단언 (assertion) => 테스트가 통과하기 위한 조건 -> 검증 실행
    // matcher :  기대 결과를 검증하기 위해 사용하는 API 집합
    // https://vitest.dev/api/expect.html#tobenull

    // 그러나 사실 vitest에는 dom의 단언과 관련된 매쳐는 없음
    // 우리는 setupTest.js에서 @testing-library/jest-dom 을 import하여 dom의 단언과 관련된 매쳐들을 추가 설치
    // toBeInTheDocument 역시 포함
    expect(textInput).toBeInTheDocument();
  });

  it('placeholder props에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });
});
