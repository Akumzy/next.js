import Image from 'next/image'

export default () => (
  <div>
    <Image src="/uploads/logo.svg" width={200} height={100} />
    <p id="stubtext">This is valid usage of the Image component</p>
  </div>
)
