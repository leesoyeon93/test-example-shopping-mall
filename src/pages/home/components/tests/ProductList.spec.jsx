import { screen, within } from '@testing-library/react';
import React from 'react';

import data from '@/__mocks__/response/products.json';
import ProductList from '@/pages/home/components/ProductList';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

const PRODUCT_PAGE_LIMIT = 5;

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      state: {
        prevPath: 'prevPath',
      },
    }),
  };
});

// 테스트 케이스 정의: 로딩이 완료된 경우 상품 리스트가 제대로 모두 노출되는지 확인
it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  // ProductList 컴포넌트를 렌더링합니다. limit 프롭으로 페이지당 제품 수를 설정합니다.
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // 'product-card' 테스트 ID를 가진 모든 요소를 찾습니다.
  const productCards = await screen.findAllByTestId('product-card');

  // 5개의 프로덕트 카드가 렌더링되었는지 확인합니다
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  // 각 제품 카드에 대해 제품 데이터가 올바르게 표시되는지 확인합니다.
  productCards.forEach((el, index) => {
    // within 함수를 사용하여 현재 제품 카드 내부의 요소들을 선택할 수 있게 합니다.
    const productCard = within(el);

    // 목업 데이터에서 현재 인덱스에 해당하는 제품 정보를 가져옵니다.
    const product = data.products[index];

    // 제품 제목이 올바르게 표시되는지 확인합니다.
    expect(productCard.getByText(product.title)).toBeInTheDocument();
    // 제품 카테고리 이름이 올바르게 표시되는지 확인합니다.
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();

    // 제품 가격이 포맷팅된 형태로 올바르게 표시되는지 확인합니다.
    expect(
      productCard.getByText(formatPrice(product.price)),
    ).toBeInTheDocument();

    // '장바구니' 버튼이 존재하는지 확인합니다.
    expect(
      productCard.getByRole('button', { name: '장바구니' }),
    ).toBeInTheDocument();

    // '구매' 버튼이 존재하는지 확인합니다.
    expect(
      productCard.getByRole('button', { name: '구매' }),
    ).toBeInTheDocument();
  });
});

it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // showmore 버튼의 노출 여부를 정확하게 판단하기 위해
  // findby 쿼리를 사용하여 먼저 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야합니다.
  await screen.findAllByTestId('product-card');

  // show more 버튼이 노출되는지 확인합니다.
  expect(screen.getByText('Show more')).toBeInTheDocument();

  // show more 버튼을 클릭합니다.
  const moreBtn = screen.getByText('Show more');
  await user.click(moreBtn);

  // show more 버튼을 클릭한 후, 추가로 상품 카드가 렌더링되는지 확인합니다.
  expect(await screen.findAllByTestId('product-card')).toHaveLength(
    PRODUCT_PAGE_LIMIT * 2,
  );
});

it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  await render(<ProductList limit={50} />);

  await screen.findAllByTestId('product-card');

  expect(screen.queryByText('Show more')).not.toBeInTheDocument();
});

describe('로그인 상태일 경우', () => {
  // 로그인 상태를 설정하기 위해 mockUseUserStore를 사용하여 isLogin을 true로 설정합니다.
  beforeEach(() => {
    mockUseUserStore({ isLogin: true, user: { id: 10 } });
  });

  it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(
      1,
      data.products[productIndex],
      10,
      1,
    );
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
  });

  it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    const product = data.products[productIndex];
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
    expect(
      screen.getByText(`${product.title} 장바구니 추가 완료!`),
    ).toBeInTheDocument();
  });
});

describe('로그인이 되어 있지 않은 경우', () => {
  it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });

  it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });
});

it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  const [firstProduct] = await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  await user.click(firstProduct);

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/6');
});
