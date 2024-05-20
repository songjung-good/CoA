import userStore from "@/store/user";
import WaveButton from "./WaveButton";

export default function UserPageTabBar({
  onClickTap,
  tabIndex,
  uuid,
}: {
  onClickTap: Function;
  tabIndex: number;
  uuid: string;
}) {
  const { UUID } = userStore();
  // Button Color
  const buttonCSS =
    "px-6 py-3 rounded-lg bg-appGrey1 hover:bg-appBlue1 whitespace-nowrap";
  const activeButtonCSS =
    "px-6 py-3 rounded-lg bg-appBlue2 hover:bg-appBlue1 whitespace-nowrap";
  function getButtonColor(key: number) {
    if (key === tabIndex) {
      return activeButtonCSS;
    } else {
      return buttonCSS;
    }
  }

  return (
    <nav
      className=" bg-appBlue4 p-4 rounded-2xl hover:border-appBlue1 border shadow-lg
      flex justify-between overflow-auto"
    >
      <div className="flex gap-4 pr-4">
        <button
          key={0}
          className={getButtonColor(0)}
          onClick={() => onClickTap(0)}
        >
          개요
        </button>
        <button
          key={1}
          className={getButtonColor(1)}
          onClick={() => onClickTap(1)}
        >
          연혁
        </button>
        <button
          key={2}
          className={getButtonColor(2)}
          onClick={() => onClickTap(2)}
        >
          레포
        </button>
        {UUID === uuid ? (
          <button
            key={3}
            className={getButtonColor(3)}
            onClick={() => onClickTap(3)}
          >
            심층분석
          </button>
        ) : null}
      </div>
      <WaveButton />
      {/* <button
        className={`${buttonCSS} bg-gradient-to-r from-[#F5E5CA] to-[#41EAE5]`}
      >
        파도타기
      </button> */}
    </nav>
  );
}
