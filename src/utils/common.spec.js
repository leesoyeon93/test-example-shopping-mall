import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

// 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행되기 때문에
// setTimeout을 사용한 debounce 테스트는 동작하지 않는다.
// 비동기 함수가 실행되기 전 단언(expect)이 실행되기 때문이다.
describe('debounce util 단위 테스트', () => {

  // teardown에서 모킹 초기화 -> 다른 테스트에 영향이 없어야한다.
  // 타이머 모킹도 초기화가 필수이다.
  // 타이머 모킹! -> 0.3초 흐는 것으로 타이머 조작 -> spy 함수 호출 확인
  beforeEach(() => {
    vi.useFakeTimers();

    // 타이머 모킹을 위해 시스템 시간을 고정한다.
    // 테스트 당시의 시간에 의존하는 테스트의 경우 , 시간을 고정하지 않으면 테스트가 실패할 수 있다.
    // setSystemTime 으로 시간을 고정하면 일관된 환경ㅇ서 테스트를 진행할 수 있다. 
    vi.setSystemTime(new Date('2023-10-01T00:00:00Z').getTime());
  });


  // 타이머 모킹을 해제
  afterEach(() => {
    vi.useRealTimers();
  });


  it('특정 시간이 지난 후 함수가 호출된다', () => {
    const spy = vi.fn();

    const debouncedFunction = debounce(spy, 300);

    debouncedFunction();

    // 타이머를 0.3초 흐르게 한다.
    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalled();
  });

  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다', () => {
    const spy = vi.fn();

    const debouncedFunction = debounce(spy, 300);

    // 최초 호출
    debouncedFunction();

    // 최초 호출 후 0.2초 흐르게 한다.
    vi.advanceTimersByTime(200);
    debouncedFunction();

    //두번째 호출 후 0.1초 흐르게 한다.
    vi.advanceTimersByTime(100);
    debouncedFunction();

    // 세번째 호출 후 0.2초 흐르게 한다.
    vi.advanceTimersByTime(200);
    debouncedFunction();

    // 네번째 호출 후 0.3초 흐르게 한다.
    // 최초 호출 후에 함수 호출 간격이 0.3초 이상 -> 이 호출이 유일함
    vi.advanceTimersByTime(300);
    debouncedFunction();

    // 다섯번을 호출했지만 실제 spy 함수는 1번만 호출된다.
    expect(spy).toHaveBeenCalledTimes(1);
  });



});
