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
})