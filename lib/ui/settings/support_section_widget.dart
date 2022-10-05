// @dart=2.9

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:photos/core/configuration.dart';
import 'package:photos/core/constants.dart';
import 'package:photos/ui/common/web_page.dart';
import 'package:photos/ui/components/captioned_text_widget.dart';
import 'package:photos/ui/components/expandable_menu_item_widget.dart';
import 'package:photos/ui/components/menu_item_widget.dart';
import 'package:photos/ui/settings/common_settings.dart';
import 'package:photos/utils/email_util.dart';

class SupportSectionWidget extends StatefulWidget {
  const SupportSectionWidget({Key key}) : super(key: key);

  @override
  State<SupportSectionWidget> createState() => _SupportSectionWidgetState();
}

class _SupportSectionWidgetState extends State<SupportSectionWidget> {
  @override
  Widget build(BuildContext context) {
    return ExpandableMenuItemWidget(
      title: "Support",
      selectionOptionsWidget: _getSectionOptions(context),
      leadingIcon: Icons.help_outline_outlined,
    );
  }

  Widget _getSectionOptions(BuildContext context) {
    final String bugsEmail =
        Platform.isAndroid ? "android-bugs@ente.io" : "ios-bugs@ente.io";
    return Column(
      children: [
        sectionOptionSpacing,
        MenuItemWidget(
          captionedTextWidget: const CaptionedTextWidget(
            text: "Email",
          ),
          trailingIcon: Icons.chevron_right_outlined,
          trailingIconIsMuted: true,
          onTap: () async {
            await sendEmail(context, to: supportEmail);
          },
        ),
        sectionOptionSpacing,
        MenuItemWidget(
          captionedTextWidget: const CaptionedTextWidget(
            text: "Roadmap",
          ),
          trailingIcon: Icons.chevron_right_outlined,
          trailingIconIsMuted: true,
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (BuildContext context) {
                  final endpoint = Configuration.instance.getHttpEndpoint() +
                      "/users/roadmap";
                  final isLoggedIn = Configuration.instance.getToken() != null;
                  final url = isLoggedIn
                      ? endpoint + "?token=" + Configuration.instance.getToken()
                      : roadmapURL;
                  return WebPage("Roadmap", url);
                },
              ),
            );
          },
        ),
        sectionOptionSpacing,
        MenuItemWidget(
          captionedTextWidget: const CaptionedTextWidget(
            text: "Report a bug",
          ),
          trailingIcon: Icons.chevron_right_outlined,
          trailingIconIsMuted: true,
          onTap: () async {
            await sendLogs(context, "Report bug", bugsEmail);
          },
          onDoubleTap: () async {
            final zipFilePath = await getZippedLogsFile(context);
            await shareLogs(context, bugsEmail, zipFilePath);
          },
        ),
        sectionOptionSpacing,
      ],
    );
  }
}
