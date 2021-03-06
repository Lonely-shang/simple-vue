import { effect, stop } from "../reactivity/effect"
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

  it('stop', () => {
    let effectAge

    const user = reactive({ age: 1 })

    const runner = effect(
      () => {
        effectAge = user.age
      }
    )

    expect(effectAge).toBe(1)

    stop(runner)

    user.age++

    expect(effectAge).toBe(1)

    runner()

    expect(effectAge).toBe(2)

  })

  it('onStop', () =>{
    let effectAge

    const user = reactive({ age: 1 })

    const onStop = jest.fn()

    const runner = effect(
      () => {
        effectAge = user.age
      },
      {
        onStop
      }
    )

    stop(runner)

    expect(onStop).toHaveBeenCalledTimes(1)

  })
})