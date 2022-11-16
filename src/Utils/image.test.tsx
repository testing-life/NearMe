import "@testing-library/react";
import { blobToBase64 } from "./image";

describe("toBase64String", () => {
  const file = new File([new ArrayBuffer(1)], "file.jpg");

  it("should return a string", async () => {
    const readAsBinaryStringSpy = jest.spyOn(
      FileReader.prototype,
      "readAsDataURL"
    );

    const content = await blobToBase64(file);
    expect(readAsBinaryStringSpy).toHaveBeenCalledWith(file);
    expect(typeof content).toBe("string");
  });
});
