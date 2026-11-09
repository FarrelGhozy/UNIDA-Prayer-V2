ALTER TABLE `scheduled_messages` DROP FOREIGN KEY `scheduled_messages_target_id_message_targets_id_fk`;
--> statement-breakpoint
ALTER TABLE `scheduled_messages` ADD CONSTRAINT `scheduled_messages_target_id_message_targets_id_fk` FOREIGN KEY (`target_id`) REFERENCES `message_targets`(`id`) ON DELETE cascade ON UPDATE cascade;