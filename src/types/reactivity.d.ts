

type Iraw = {
  [name: string]: any;
}

type Ifun = fun | reFun

type fun = () => void
type reFun = () => any

interface IeffectOptions{
  scheduler?: () => void;
  onStop?: () => void;
}

interface IeffectReactiveRunner {
  () : void,
  effect: EffectReactive
}