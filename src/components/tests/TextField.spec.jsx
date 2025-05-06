import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

beforeEach(() => {});

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

  // vitest의 expect 함수를 사용하여 기대 결과를 검증

  // ✅ className이란 내부 prop이나 state 값을 검증 (x)
  // ✅ 랜더링되는 DOM 구조가 올바르게 변경되었는지 확인 (o) => 최종적으로 사용자가 보는 결과는 DOM
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'my-class',
  );
});

describe('placeholder', () => {
  // 기대결과 === 실제결과 -> 성공
  // 기대결과 !== 실제결과 -> 실패
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    screen.debug();

    expect(textInput).toBeInTheDocument();
    // 단언(assertion) : 테스트가 통과하기 위한 조건 -> 검증 실행
    // 매쳐 : 기대 결과를 검증하기 위해 사용되는 함수들
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    // toBeInTheDocument : DOM에 존재하는지 검증하는 matcher
    expect(textInput).toBeInTheDocument();
  });
});

it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
  // spy : 테스트에서 호출 여부를 확인하기 위한 더미 함수
  const spy = vi.fn();

  const { user } = await render(<TextField onChange={spy} />);

  // getByPlaceholderText : placeholder 속성으로 DOM 요소를 찾는 matcher
  // https://testing-library.com/docs/dom-testing-library/cheatsheet/#queries
  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // type : 사용자 이벤트를 시뮬레이션하는 메서드
  // 실제로 사용자가 입력하는 것처럼 동작 -> 'test'라는 문자열을 입력
  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});

it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();

  const { user } = await render(<TextField onEnter={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // type 메서드로 'test'라는 문자열을 입력하고 엔터키를 눌러줌
  await user.type(textInput, 'test{Enter}');

  expect(spy).toHaveBeenCalledWith('test');
});

it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onFocus={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(spy).toHaveBeenCalled();
});

it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
  const { user } = await render(<TextField />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(textInput).toHaveStyle({
    borderWidth: '2px',
    borderColor: 'rgb(25, 118, 210)',
  });
});
