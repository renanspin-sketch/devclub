import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useCopyToClipboard } from "./useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copia o texto para a área de transferência e marca isCopied", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.isCopied).toBe(false);

    await act(async () => {
      await result.current.copy("contato@devclub.dev");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("contato@devclub.dev");
    expect(result.current.isCopied).toBe(true);
  });

  it("volta isCopied para false depois do delay configurado", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.isCopied).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it("se a Clipboard API falhar, isCopied permanece false", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("permissão negada")) },
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("x");
    });

    expect(result.current.isCopied).toBe(false);
  });
});
