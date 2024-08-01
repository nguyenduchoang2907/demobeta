interface Props {
  searchParams: {
    code: string
    state: string
  }
}
const LinePage = (props: Props) => {
  console.log(props.searchParams)
  return (
    <div>
      <h1 className="text-other-blue">Line Page</h1>
      <div className="text-other-blue">line login</div>
    </div>
  )
}

export default LinePage
