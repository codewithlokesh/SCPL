import adminMasters from "../SuperAdmin/AdminMaster/index.route";

export default function route() {
  return [
    ...adminMasters()
]
}
