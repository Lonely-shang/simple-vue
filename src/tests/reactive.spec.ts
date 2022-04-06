import { reactive } from "../reactivity/reactive"


describe('reactive', () => {

  it('happy', () => {

    const my = { name: 'Miliky'}

    const reactiveMy = reactive(my)

    expect(reactiveMy).not.toBe(my)

    expect(reactiveMy.name).toBe('Miliky')


  })

})