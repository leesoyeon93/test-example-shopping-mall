import { screen } from '@testing-library/react';
import React from 'react';

import ErrorPage from '@/pages/error/components/ErrorPage';
import render from '@/utils/test/render';

const navigateFn = vi.fn();

// vi.mock : 특정 모듈을 원하는 형태로 대체할 수 있습니다.
// 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행
// vi.react-router-dom의 useNavigate를 모킹해봅시다.
vi.mock('react-router-dom', async () => {
  // importActual: 일부 모듈에 대해서만 모킹을 하고, 나머지는 기존 모듈의 기능을 그대로 사용하고 싶은 경우 사용
  const original = await vi.importActual('react-router-dom');

  return { ...original, useNavigate: () => navigateFn };
});
it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  const { user } = await render(<ErrorPage />);

  // 버튼을 지정 => 뒤로 이동 이란 이름을 가진 버튼을 찾음
  const button = await screen.getByRole('button', { name: '뒤로 이동' });

  await user.click(button);

  // 에러 페이지의 경우 navigateFn을 호출할때 -1을 인자로 넘겼기에 -1이 올바르게 전달되었는지 단언하면 됨.
  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});
