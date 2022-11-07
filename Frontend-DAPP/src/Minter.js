import { useEffect, useState } from "react"
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from "./utils/interact.js"

const Minter = props => {
  //State variables
  const [walletAddress, setWallet] = useState("")
  const [status, setStatus] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fileImg, setFileImg] = useState("")

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus(
            "To freeze your metadeta you have to create your item first"
          )
        } else {
          setWallet("")
          setStatus("Connect to Metamask using the top right button.")
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      )
    }
  }
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)
    addWalletListener()
  }, [])

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  }
  const onMintPressed = async () => {
    const { status } = await mintNFT(fileImg, name, description)
    setStatus(status)
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: Your metamask wallet address is " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect your Wallet with MetaMask</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Create New Item</h1>
      <p>Required Fields *</p>
      <form>
        <h2>Upload Image </h2>
        <input
          type="file"
          onChange={e => setFileImg(e.target.files[0])}
          required
        />
        <h2>Name</h2>
        <input
          type="text"
          placeholder="Your Full Name"
          onChange={event => setName(event.target.value)}
        />
        <h2>Description</h2>
        <input
          type="text"
          placeholder="Provide the detailed description about your item"
          onChange={event => setDescription(event.target.value)}
        />
      </form>
      <button
        disabled={!fileImg && !description && !name}
        id={
          !fileImg && !description && !name
            ? "mintButtonDisabled"
            : "mintButton"
        }
        onClick={onMintPressed}
      >
        Create
      </button>
      <p id="status">{status}</p>
    </div>
  )
}

export default Minter
