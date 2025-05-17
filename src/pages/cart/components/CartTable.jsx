import { Divider } from '@mui/material';
import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import PriceSummary from '@/pages/cart/components/PriceSummary';
import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';

// 본 강의에서는 ProductInfoTable, PriceSummary 로 나누어 통합테스트를 작성합니다.
// PageTitle, Divider 는 단순 UI 컴포넌트이므로 통합테스트에서 제외합니다.
// ProductInfoTabled와 PriceSummary 는 zustand의 state를 사용하여 데이터를 랜더링하는 컴포넌트입니다. -> 테스트 필요!
// CartTable 로 통합테스트를 하면 -> 큰 범위의 통합테스트로 모킹해야하는 정보가 많아 변경에 테스트가 깨지기 쉽습니다.

// ProductInfoTable , PriceSummary -> 각각 별도로 zustand store에서 필요한 state와 action을 가져옵니다.
// 독립적으로 분리하여 통합테스트로 필요한 비즈니스 로직을 검증하기에 적합합니다.
const CartTable = () => {
  return (
    <>
      <PageTitle />
      <ProductInfoTable />
      <Divider sx={{ padding: 2 }} />
      <PriceSummary />
    </>
  );
};

export default CartTable;
