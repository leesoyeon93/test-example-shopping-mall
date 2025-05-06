import { render } from '@testing-library/react'; // React 컴포넌트를 렌더링하기 위한 함수 가져오기
import userEvent from '@testing-library/user-event'; // 사용자 이벤트를 시뮬레이션하기 위한 라이브러리 가져오기

// 컴포넌트 테스트를 위한 헬퍼 함수 내보내기
export default async component => {
  // userEvent : 사용자의 행동을 시뮬레이션하는 라이브러리
  const user = userEvent.setup(); // userEvent 설정 초기화

  // 함수에서 user 객체와 render 함수의 결과를 함께 반환
  // 스프레드 연산자(...)를 사용하여 render 함수의 모든 반환값을 포함
  return {
    user,
    ...render(component), // 컴포넌트를 렌더링하고 결과(쿼리 함수들)를 반환
  };
};
