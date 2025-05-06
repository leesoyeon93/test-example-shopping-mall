import { renderHook, act } from '@testing-library/react';
import useConfirmModal from './useConfirmModal';

describe('useConfirmModal', () => {
  it('호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.', () => {
    const { result } = renderHook(() => useConfirmModal());
    expect(result.current.isModalOpened).toBe(false);
  });

  it('호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.', () => {
    const { result } = renderHook(() => useConfirmModal(true));
    expect(result.current.isModalOpened).toBe(true);
  });

  it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {

    const { result } = renderHook(() => useConfirmModal());
  
    // toggleIsModalOpened 호출
    // result.current.toggleIsModalOpened();

    act(() => {
      result.current.toggleIsModalOpened();
    });
  
    // 호출 후 false -> true로 바뀐 것을 단언
    expect(result.current.isModalOpened).toBe(true);
  });
});