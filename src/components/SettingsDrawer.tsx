import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, propNames, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { ISettingsDict, ISettingsList } from "../types";
import { useInvoker, useRPC } from "../services/jsonrpc";
import GeneralSettingsTab from "./settings/GeneralSettingsTab";
import ProxySettingsTab from "./settings/ProxySettingsTab";
import QueueingSettingsTab from "./settings/QueueingSettingsTab";
import ConnectionSettingsTab from "./settings/NetworkSettingsTab";
import DiskIoSettingsTab from "./settings/DiskIoSettingsTab";
import LibtorrentSettingsTab from "./settings/LibtorrentSettingsTab";
import WebUiSettingsTab from "./settings/WebUiSettingsTab";

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsSchema = Yup.object().shape({
  active_checking: Yup.number().required("Required").min(-1, "Cannot be less than -1"),
  active_downloads: Yup.number().required("Required").min(-1, "Cannot be less than -1"),
  active_limit: Yup.number().required("Required").min(-1, "Cannot be less than -1"),
  active_seeds: Yup.number().required("Required").min(-1, "Cannot be less than -1"),
  listen_interfaces: Yup.array()
    .transform(function (value, originalValue) {
      if (this.isType(value) && value !== null) {
        return value;
      }
      return originalValue ? originalValue.split(/[\s,]+/) : [];
    })
    .required("Listen interfaces is required")
    .of(
      Yup.string()
        .matches(/^(.*)\:[\d]+$/gm, { message: "Listen interfaces contains invalid data." })),
  proxy_type: Yup.number().required(),
  proxy_hostname: Yup.string()
    .when("proxy_type", {
      is: (v: number) => v > 0,
      then: (schema) => schema.required("Proxy hostname is required.")
    }),
  proxy_port: Yup.number()
    .when("proxy_type", {
      is: (v: number) => v > 0,
      then: (schema) => schema
        .required("Port number is required")
        .moreThan(0, "Port number must be greater than 0.")
    }),
  torrent_connect_boost: Yup.number().required().max(255)
});

type SettingsFormProps = {
  onSubmitted: () => void;
  onSubmitting: (isSubmitting: boolean) => void;
  settings: ISettingsDict;
}

function SettingsForm(props: SettingsFormProps) {
  const { onSubmitted, onSubmitting, settings } = props;

  const sessionSettingsUpdate = useInvoker<void>("sessions.settings.update");

  return (
    <Formik
      initialValues={{
        ...settings
      }}
      onSubmit={async (values) => {
        onSubmitting(true);

        const delta = Object.entries(values)
          .reduce((prev, [key, value]) => {
            if ((settings as any)[key] !== value) {
              prev[key] = value;
            }
            return prev;
          }, {} as {
            [index: string]: boolean | number | string
          });

        if ("listen_interfaces" in delta && typeof delta.listen_interfaces === "string") {
          delta.listen_interfaces = delta.listen_interfaces.replace("\n", ",");
        }

        await sessionSettingsUpdate({
          settings: delta
        });

        // Not even ashamed of this.
        await new Promise(r => setTimeout(r, 500));

        onSubmitting(false);
        onSubmitted();
      }}
      validationSchema={SettingsSchema}
    >
      <Form
        id={"settings"}
      >
        <Tabs variant={'line'}>
          <TabList>
            <Tab>General</Tab>
            <Tab>Disk I/O</Tab>
            <Tab>Network</Tab>
            <Tab>Proxy</Tab>
            <Tab>Queueing</Tab>
            <Tab>Libtorrent</Tab>
            <Tab>Web UI</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <GeneralSettingsTab />
            </TabPanel>
            <TabPanel>
              <DiskIoSettingsTab />
            </TabPanel>
            <TabPanel>
              <ConnectionSettingsTab />
            </TabPanel>
            <TabPanel>
              <ProxySettingsTab />
            </TabPanel>
            <TabPanel>
              <QueueingSettingsTab />
            </TabPanel>
            <TabPanel>
              <LibtorrentSettingsTab settings={settings} />
            </TabPanel>
            <TabPanel>
              <WebUiSettingsTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Form>
    </Formik>
  )
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
  const { data, error, mutate } = useRPC<ISettingsList>("sessions.settings.list", {
    keys: [
      "active_checking",
      "active_downloads",
      "active_limit",
      "active_seeds",
      "allow_multiple_connections_per_ip",
      "allowed_fast_set_size",
      "announce_to_all_trackers",
      "auto_manage_interval",
      "auto_manage_prefer_seeds",
      "auto_scrape_interval",
      "auto_scrape_min_interval",
      "checking_mem_usage",
      "choking_algorithm",
      "connection_speed",
      "connections_limit",
      "disk_write_mode",
      "dont_count_slow_torrents",
      "file_pool_size",
      "hashing_threads",
      "inactive_down_rate",
      "inactive_up_rate",
      "inactivity_timeout",
      "incoming_starts_queued_torrents",
      "initial_picker_threshold",
      "listen_interfaces",
      "listen_queue_size",
      "max_allowed_in_request_queue",
      "max_failcount",
      "max_out_request_queue",
      "max_peer_recv_buffer_size",
      "max_queued_disk_bytes",
      "min_reconnect_time",
      "mixed_mode_algorithm",
      "max_rejects",
      "mmap_file_size_cutoff",
      "no_atime_storage",
      "peer_timeout",
      "peer_turnover",
      "peer_turnover_cutoff",
      "peer_turnover_interval",
      "predictive_piece_announce",
      "proxy_type",
      "proxy_hostname",
      "proxy_port",
      "proxy_username",
      "proxy_password",
      "proxy_hostnames",
      "proxy_peer_connections",
      "proxy_tracker_connections",
      "rate_choker_initial_threshold",
      "request_timeout",
      "seed_choking_algorithm",
      "seed_time_ratio_limit",
      "send_buffer_low_watermark",
      "send_buffer_watermark",
      "send_buffer_watermark_factor",
      "send_not_sent_low_watermark",
      "share_ratio_limit",
      "strict_end_game_mode",
      "suggest_mode",
      "torrent_connect_boost",
      "unchoke_slots_limit",
      "use_parole_mode",
      "whole_pieces_threshold",

      // Libtorrent tab (everything not already covered by the tabs above)
      "active_dht_limit",
      "active_lsd_limit",
      "active_tracker_limit",
      "aio_threads",
      "allow_i2p_mixed",
      "allow_idna",
      "allowed_enc_level",
      "always_send_user_agent",
      "announce_crypto_support",
      "announce_ip",
      "announce_to_all_tiers",
      "anonymous_mode",
      "apply_ip_filter_to_trackers",
      "auto_manage_startup",
      "auto_sequential",
      "ban_web_seeds",
      "close_file_interval",
      "close_redundant_connections",
      "connect_seed_every_n_download",
      "connections_slack",
      "dht_aggressive_lookups",
      "dht_announce_interval",
      "dht_block_ratelimit",
      "dht_block_timeout",
      "dht_bootstrap_nodes",
      "dht_enforce_node_id",
      "dht_extended_routing_table",
      "dht_ignore_dark_internet",
      "dht_item_lifetime",
      "dht_max_dht_items",
      "dht_max_fail_count",
      "dht_max_infohashes_sample_count",
      "dht_max_peers",
      "dht_max_peers_reply",
      "dht_max_torrent_search_reply",
      "dht_max_torrents",
      "dht_prefer_verified_node_ids",
      "dht_privacy_lookups",
      "dht_read_only",
      "dht_restrict_routing_ips",
      "dht_restrict_search_ips",
      "dht_sample_infohashes_interval",
      "dht_search_branching",
      "dht_upload_rate_limit",
      "disable_hash_checks",
      "disk_io_read_mode",
      "disk_io_write_mode",
      "download_rate_limit",
      "enable_dht",
      "enable_incoming_tcp",
      "enable_incoming_utp",
      "enable_ip_notifier",
      "enable_lsd",
      "enable_natpmp",
      "enable_outgoing_tcp",
      "enable_outgoing_utp",
      "enable_set_file_valid_data",
      "enable_upnp",
      "handshake_client_version",
      "handshake_timeout",
      "i2p_hostname",
      "i2p_port",
      "in_enc_policy",
      "listen_system_port_fallback",
      "local_service_announce_interval",
      "max_concurrent_http_announces",
      "max_http_recv_buffer_size",
      "max_metadata_size",
      "max_paused_peerlist_size",
      "max_peerlist_size",
      "max_pex_peers",
      "max_piece_count",
      "max_retry_port_bind",
      "max_suggest_pieces",
      "max_web_seed_connections",
      "metadata_token_limit",
      "min_announce_interval",
      "no_connect_privileged_ports",
      "no_recheck_incomplete_resume",
      "num_optimistic_unchoke_slots",
      "num_outgoing_ports",
      "num_want",
      "optimistic_disk_retry",
      "optimistic_unchoke_interval",
      "out_enc_policy",
      "outgoing_interfaces",
      "outgoing_port",
      "peer_connect_timeout",
      "peer_dscp",
      "peer_fingerprint",
      "piece_extent_affinity",
      "piece_timeout",
      "prefer_rc4",
      "prefer_udp_trackers",
      "prioritize_partial_pieces",
      "rate_limit_ip_overhead",
      "recv_socket_buffer_size",
      "report_redundant_bytes",
      "report_true_downloaded",
      "report_web_seed_downloads",
      "request_queue_time",
      "resolver_cache_timeout",
      "seed_time_limit",
      "seeding_outgoing_connections",
      "seeding_piece_quota",
      "send_redundant_have",
      "send_socket_buffer_size",
      "share_mode_target",
      "smooth_connects",
      "socks5_udp_send_local_ep",
      "ssrf_mitigation",
      "stop_tracker_timeout",
      "support_share_mode",
      "tick_interval",
      "tracker_backoff",
      "tracker_completion_timeout",
      "tracker_maximum_response_length",
      "tracker_receive_timeout",
      "udp_tracker_token_expiry",
      "unchoke_interval",
      "upload_rate_limit",
      "upnp_ignore_nonrouters",
      "upnp_lease_duration",
      "urlseed_max_request_bytes",
      "urlseed_pipeline_size",
      "urlseed_timeout",
      "urlseed_wait_retry",
      "use_dht_as_fallback",
      "user_agent",
      "utp_connect_timeout",
      "utp_cwnd_reduce_timer",
      "utp_fin_resends",
      "utp_gain_factor",
      "utp_loss_multiplier",
      "utp_min_timeout",
      "utp_num_resends",
      "utp_syn_resends",
      "utp_target_delay",
      "validate_https_trackers",
      "web_seed_name_lookup_retry"
    ]
  });

  const [ submitting, setSubmitting ] = useState(false);

  return (
    <Drawer
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={"xl"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Settings</DrawerHeader>
        <DrawerBody>
          {
            error
              ? <div>{error.toString()}</div>
              : !data
                ? <Box><Spinner /></Box>
                : <SettingsForm
                  onSubmitted={() => mutate()}
                  onSubmitting={setSubmitting}
                  settings={data.settings}
                />
          }
        </DrawerBody>
        <DrawerFooter>
          <Spinner visibility={submitting ? "visible" : "hidden"} mr={3} />
          <Button
            colorScheme={"purple"}
            disabled={submitting}
            type={"submit"}
            form={"settings"}
          >
            Save settings
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
