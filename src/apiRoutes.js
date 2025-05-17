// 테스트에서 API 호출 -> 실행 시간 증가, 서버 이슈로 인한 테스트 실패
// API 응답 모킹 -> 일관된 테스트 환경 구성 가능
// Tanstant Query -> API 호출을 관리하는 라이브러리
export const apiRoutes = {
  users: '/users',
  login: '/login',
  profile: '/user',
  products: '/products',
  product: '/products/:productId',
  categories: '/categories',
  couponList: '/couponList',
  purchase: '/purchase',
  log: '/log',
};

export const pageRoutes = {
  main: '/',
  login: '/login',
  register: '/register',
  productDetail: '/product/:productId',
  cart: '/cart',
  purchase: '/purchase',
};
