import { effect } from "../reactivity/effect"
import { reactive } from "../reactivity/reactive"


describe('effect', () => {

  it('happy path', () => {

    const user = reactive({ age: 1 })

    let effectUser
    effect(() => {
      effectUser = user.age + 1
    })

    expect(effectUser).toBe(2)

    user.age++

    expect(effectUser).toBe(3)

  })

  it('scheduler', () => {

    let run, effectAge;

    const user = reactive({ age: 1 });

    let scheduler = jest.fn(() => {
      run = runner;
    });

    const runner = effect(
      () => {
        effectAge = user.age;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();

    expect(effectAge).toBe(1);

    user.age++

    expect(scheduler).toBeCalledTimes(1);

    run();

    expect(effectAge).toBe(2)

  })

})