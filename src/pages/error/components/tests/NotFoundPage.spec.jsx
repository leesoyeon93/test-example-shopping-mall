import { screen } from '@testing-library/react';
import React from 'react';

import NotFoundPage from '@/pages/error/components/NotFoundPage';
import render from '@/utils/test/render';

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');

  return { ...original, useNavigate: () => navigateFn };
});

it('Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다', async () => {
  const { user } = await render(<NotFoundPage />);

  // 버튼을 지정 => 뒤로 이동 이란 이름을 가진 버튼을 찾음
  const button = await screen.getByRole('button', { name: '뒤로 이동' });

  await user.click(button);

  // 에러 페이지의 경우 navigateFn을 호출할때 -1을 인자로 넘겼기에 -1이 올바르게 전달되었는지 단언하면 됨.
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/', { replace: true });
});
