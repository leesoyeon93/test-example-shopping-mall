import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

// ✅ useNavigate 훅으로 반환받은 nagivate 함수가 올바르게 호출되었는가??? => spy함수
const navigateFn = vi.fn();

// vi.mock : 특정 모듈을 원하는 형태로 대체할 수 있습니다.
// 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행
// vi.react-router-dom의 useNavigate를 모킹해봅시다.
vi.mock('react-router-dom', async () => {
  // importActual: 일부 모듈에 대해서만 모킹을 하고, 나머지는 기존 모듈의 기능을 그대로 사용하고 싶은 경우 사용
  const original = await vi.importActual('react-router-dom');

  return { ...original, useNavigate: () => navigateFn };
});

it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate함수가 호출된다', async () => {
  const { user } = await render(<EmptyNotice />);
  await user.click(screen.getByText('홈으로 가기'));

  // toHaveBeenNthCalledWith를 사용해 루트 경로로 한 번만 넘어가는지 단언함
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});
