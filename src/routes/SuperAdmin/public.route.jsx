import auth from "./Auth/index.route";

export default function route() {
  return [
    ...auth()
]
}
