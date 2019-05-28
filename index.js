const { withUiHook, htm } = require('@zeit/integration-utils')
const axios = require('axios');

module.exports = withUiHook(async ({ payload, zeitClient }) => {

  const metadata = await zeitClient.getMetadata();

  const fetch = () => {
    axios.get('https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=8f2c34cc2f3c6732613d01a12c241a3d9f666d8230a3ab40b7718f2c90843e13')
    .then(response => {
       metadata.trelloUser = response.data;
    })
  }

  fetch();

  await zeitClient.setMetadata(metadata);

  mapBoards = board => {
    return htm`
    <LI>
      <P>${board.name}</P>
      <P>${board.dateLastActivity}</P>
      <P>${board.shortLink}</P>
      <P>${board.id}</P>
      <P>${board.url}</P>
    </LI>
    `
  }

  console.log(metadata.trelloUser[0].memberships[0]);

  return htm`
    <Page>
      <Button> 
        <Link href="https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key=e586378fdc0f7152e1d0efa486b7a346">Authenticate</Link>
      </Button>
      <Button backgroundColor="blue" action="fetch">Fetch</Button>
      <P>Trello User: Naught</P>
      <ProjectSwitcher />
      <Input name="test" value="gg">${payload.clientState.test}</Input>
      ${metadata.trelloUser.map(board => mapBoards(board))}
      <P>Token: ${payload.token} </P>
      <P>Username: ${payload.user.username} </P>
      <P>Install integration: ${payload.installationUrl} </P>
    </Page>
  `
})