import IHttpResponseHandler from "src/common/IHttpResponseHandler"
import AccountLoginHandler from "./account/Login";
import AccountTokenLoginHandler from "./account/TokenLogin";
import QueryCurrRegionHandler from "./dispatch/QueryCurrRegion";
import QueryRegionListHandler from "./dispatch/QueryRegionList";
import VersionsHandler from "./resource/Versions";

const mappings: Record<string, IHttpResponseHandler> = {
  /* DISPATCH */
  "/query_region_list": new QueryRegionListHandler(),
  "/query_cur_region": new QueryCurrRegionHandler(),

  /* GAMEAPI */
  "/sdk/login": new AccountLoginHandler(),
  "/sdk/token_login": new AccountTokenLoginHandler(),

  /* DATA & RESOURCE */
  "/data/cur_version.txt": new VersionsHandler(),
  "/resource/cur_version.txt": new VersionsHandler(),
  "/resource/output_138541/client/StandaloneWindows64/AssetBundles/bundle_versions": new VersionsHandler(),
  "/resource/output_138541/client/StandaloneWindows64/AssetBundles/asset_index": new VersionsHandler(),
  "/resource/output_138541/client/StandaloneWindows64/AudioAssets/audio_versions": new VersionsHandler(),
  "/resource/output_138541/client/StandaloneWindows64/VideoAssets/video_versions": new VersionsHandler(),
};

export default mappings;