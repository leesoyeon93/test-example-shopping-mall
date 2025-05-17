import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

// 해당 데이터를 기준으로 테스트 실행
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://user-images.githubusercontent.com/35371660/230712070-afa23da8-1bda-4cc4-9a59-50a263ee629f.png',
          'https://user-images.githubusercontent.com/35371660/230711992-01a1a621-cb3d-44a7-b499-20e8d0e1a4bc.png',
          'https://user-images.githubusercontent.com/35371660/230712056-2c468ef4-45c9-4bad-b379-a9a19d9b79a9.png',
        ],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 442,
        description:
          'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
        images: [
          'https://user-images.githubusercontent.com/35371660/230762100-b119d836-3c5b-4980-9846-b7d32ea4a08f.png',
          'https://user-images.githubusercontent.com/35371660/230762118-46d965ab-7ea8-4e8a-9c0f-3ed90f96e1cd.png',
          'https://user-images.githubusercontent.com/35371660/230762139-002578da-092d-4f34-8cae-2cf3b0dfabe9.png',
        ],
        count: 4,
      },
    },
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  // ProductInfoTable 컴포넌트를 렌더링합니다.
  await render(<ProductInfoTable />);

  // screen.getAllByRole('row')를 사용하여 테이블의 모든 행을 가져옵니다.
  const [firstItem, secondItem] = screen.getAllByRole('row');

  // 상품명이 올바르게 표시되는지 (getByText)
  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();

  // 수량이 올바르게 표시되는지 (getByRole('textbox'))
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');

  // 총 가격이 올바르게 계산되어 표시되는지 (getByText)
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();

  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4');
  expect(within(secondItem).getByText('$1,768.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  // render 함수를 호출하여 ProductInfoTable 컴포넌트를 렌더링하고, 반환된 객체에서 user 객체를 구조 분해 할당으로 추출합니다.
  // user 객체는 Testing Library의 userEvent를 사용하여 사용자 상호작용을 시뮬레이션합니다.
  const { user } = await render(<ProductInfoTable />);

  // screen.getAllByRole('row')를 사용하여 테이블의 모든 행을 가져오고, 첫 번째 행을 선택합니다.
  const [firstItem] = screen.getAllByRole('row');

  // within(firstItem).getByRole('textbox')로 해당 행 내의 텍스트 입력 필드(수량 입력란)를 찾습니다.
  const input = within(firstItem).getByRole('textbox');

  // user.clear(input)로 기존 입력 값(이전 테스트에서는 '3')을 지웁니다.
  await user.clear(input);

  // user.type(input, '5')로 새 값 '5'를 입력합니다.
  await user.type(input, '5');

  // 2427 + 809 * 2 = 4045
  // expect(screen.getByText('$4,045.00')).toBeInTheDocument()로 이 값이 화면에 올바르게 표시되는지 확인합니다.
  expect(screen.getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  // vi.fn()을 사용하여 모의 함수(mock function)인 alertSpy를 생성합니다.
  const alertSpy = vi.fn();

  // vi.stubGlobal('alert', alertSpy)를 사용하여 전역 alert 함수를 alertSpy로 대체합니다.
  // 이를 통해 alert 함수 호출을 모니터링하고 검증할 수 있습니다.
  vi.stubGlobal('alert', alertSpy);

  //render(<ProductInfoTable />)로 컴포넌트를 렌더링하고 user 객체를 가져옵니다.
  const { user } = await render(<ProductInfoTable />);

  //screen.getAllByRole('row')로 테이블 행들을 가져오고 첫 번째 행을 선택합니다.
  const [firstItem] = screen.getAllByRole('row');

  //within(firstItem).getByRole('textbox')로 수량 입력 필드를 찾습니다.
  const input = within(firstItem).getByRole('textbox');

  //user.clear(input)로 기존 입력 값을 지웁니다.
  await user.clear(input);

  //user.type(input, '1000')으로 유효하지 않은 값인 '1000'을 입력합니다.
  await user.type(input, '1000');

  //expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!')를 사용하여 alert 함수가 첫 번째 호출에서 "최대 999개 까지 가능합니다!" 메시지와 함께 호출되었는지 확인합니다.
  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  // 컴포넌트를 렌더링하고 user 객체를 가져옵니다.
  // user 객체는 사용자 상호작용을 시뮬레이션하는 데 사용됩니다.
  const { user } = await render(<ProductInfoTable />);

  // 테이블의 모든 행을 가져오고, 두 번째 행(인덱스 1)을 선택합니다.
  // 여기서 첫 번째 요소는 무시하고(콤마를 사용해 스킵) 두 번째 요소만 가져옵니다.
  const [, secondItem] = screen.getAllByRole('row');

  // 두 번째 행 내의 버튼(삭제 버튼)을 찾습니다.
  const deleteButton = within(secondItem).getByRole('button');

  //  삭제하기 전에 "Awesome Concrete Shirt" 상품이 화면에 존재하는지 확인합니다.
  expect(screen.getByText('Awesome Concrete Shirt')).toBeInTheDocument();

  // 사용자가 삭제 버튼을 클릭하는 액션을 시뮬레이션합니다.
  await user.click(deleteButton);

  // 삭제 후에 "Awesome Concrete Shirt" 상품이 화면에서 사라졌는지 확인합니다.
  // 여기서 getByText 대신 queryByText를 사용한 것에 주목하세요. getByText는 요소를 찾지 못하면 오류를 발생시키지만, queryByText는 요소를 찾지 못하면 null을 반환합니다. 따라서 요소가 없는지 확인할 때는 queryByText가 적합합니다.
  expect(screen.queryByText('Awesome Concrete Shirt')).not.toBeInTheDocument();
});
