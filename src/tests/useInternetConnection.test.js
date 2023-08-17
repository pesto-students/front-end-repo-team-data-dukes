import { renderHook, act } from '@testing-library/react-hooks';
import { useInternetConnection } from '../hooks/useInternetConnection'; // Update the path to your module

describe('useInternetConnection', () => {
  beforeAll(() => {
    // Mock window.addEventListener to track its calls
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set isOnline to true when online event is triggered', () => {
    const { result } = renderHook(() => useInternetConnection());

    expect(result.current.isOnline).toBe(true);

    const onlineHandler = window.addEventListener.mock.calls[0][1];
    act(() => {
      onlineHandler();
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should set isOnline to false when offline event is triggered', () => {
    const { result } = renderHook(() => useInternetConnection());

    expect(result.current.isOnline).toBe(true);

    const offlineHandler = window.addEventListener.mock.calls[1][1];
    act(() => {
      offlineHandler();
    });

    expect(result.current.isOnline).toBe(false);
  });

  it('should add and remove online/offline handlers', () => {
    const { result } = renderHook(() => useInternetConnection());

    const onlineHandler = jest.fn();
    const offlineHandler = jest.fn();

    act(() => {
      result.current.addOnlineHandler(onlineHandler);
      result.current.addOfflineHandler(offlineHandler);
    });

    expect(window.addEventListener).toHaveBeenCalledTimes(4);

    act(() => {
      result.current.addOnlineHandler(onlineHandler);
      result.current.addOfflineHandler(offlineHandler);
    });

    expect(window.addEventListener).toHaveBeenCalledTimes(6);

    act(() => {
      result.current.addOnlineHandler(onlineHandler);
      result.current.addOfflineHandler(offlineHandler);
    });

    expect(window.removeEventListener).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.addOnlineHandler(onlineHandler);
      result.current.addOfflineHandler(offlineHandler);
      result.current.addOnlineHandler(onlineHandler);
      result.current.addOfflineHandler(offlineHandler);
    });

    expect(window.removeEventListener).toHaveBeenCalledTimes(0);
  });
});
