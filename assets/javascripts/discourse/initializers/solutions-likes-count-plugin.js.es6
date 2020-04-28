import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeWithApi(api) {
  if (api && Discourse.SiteSettings.enable_solutions_and_likes_count_plugin) {
    api.includePostAttributes('likes_recieved_count', 'accepted_answers_count', 'user_trust_level');
    api.decorateWidget('poster-name:after', function(helper) {
      const solutionsCount = helper.attrs.accepted_answers_count;
      const likesCount = helper.attrs.likes_recieved_count;
      const trustLevel = helper.attrs.user_trust_level;
      const trustLevelName = trustLevel ? Discourse.Site.currentProp('trustLevels').findBy('id', trustLevel).name : '';
      const isAdmin = helper.attrs.admin;
      const isModerator = helper.attrs.moderator;
      
      const i18nKey = `solutions_likes_plugin`;

      const likesHTML = likesCount > 0 ? I18n.t(`${i18nKey}.likes`, { count: likesCount }) : '';
      const solutionsHTML = solutionsCount > 0 ? I18n.t(`${i18nKey}.solutions`, { count: solutionsCount }) : '';
      const rankHTML = isAdmin? '<b style="color:#FF0000;">' + I18n.t(`${i18nKey}.user_type.admin`) + "</b>":(isModerator? '<b style="color:#FF9333;">' + I18n.t(`${i18nKey}.user_type.moderator`) + "</b>":trustLevelName.capitalize()); // checks if user is admin, mod or normal, and shows role or trust level.
      
      const htmlCodes = [];
      htmlCodes.push(
        rankHTML,
        likesHTML,
        solutionsHTML,
      );

      const htmlString = htmlCodes.filter(code => code.length > 0).join("&nbsp;&nbsp;<b>|</b>&nbsp;&nbsp;");

      return helper.rawHtml(
        `<div class="solutions-likes-count">
          ${htmlString}
        </div>`
      )
    });
  }
}

export default {
  name: 'solutions-likes-count-plugin',
  initialize() {
    withPluginApi('0.8.13', initializeWithApi);
  }
};
