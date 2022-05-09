import { computed } from "../reactivity/computed"
import { reactive } from "../reactivity/reactive"

describe('computed', () => {

  it('happy path', () => {
    const user = reactive({
      age: 27
    })

    const wapper = computed(() => {
      return user.age
    })

    user.age = 18

    expect(wapper.value).toBe(18)
  })

  it("should compute lazily", () => {
    const user = reactive({
      age: 1,
    });
    const getter = jest.fn(() => {
      return user.age;
    });

    const cUser = computed(getter);

    expect(getter).not.toHaveBeenCalled();

    expect(cUser.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    cUser.value;
    expect(getter).toHaveBeenCalledTimes(1);

    user.age = 18;
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cUser.value).toBe(18);
    expect(getter).toHaveBeenCalledTimes(2);

    cUser.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
})