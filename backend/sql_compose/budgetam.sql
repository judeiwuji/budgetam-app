drop database if exists budgetam_db;
create database if not exists budgetam_db;
create user if not exists 'budgetam_backend_user'@'budgetam_mysql_db';
set password for 'budgetam_backend_user'@'budgetam_mysql_db' = 'helloworld2024';
grant all on budgetam_db.* to 'budgetam_backend_user'@'budgetam_budgetam_mysql_db';
grant select on performance_schema.* to 'budgetam_backend_user'@'budgetam_mysql_db';
flush privileges;
use budgetam_db;

create table users (
	`id` varchar(40) PRIMARY KEY NOT NULL,
	`username` varchar(50),
	`password` varchar(255),
	`email` varchar(255),
	`avatar` varchar(255),
	`created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted` datetime,
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table categories (
    `id` varchar(40) PRIMARY KEY NOT NULL,
    `cat_name` varchar(255) NOT NULL,
    `is_expense` boolean DEFAULT False,
    `icon` varchar(255) NOT NULL DEFAULT "https://robohash.org/odioexpeditapraesentium.png?size=50x50&set=set1",
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted` datetime,
    UNIQUE KEY `cat_name` (`cat_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table transactions (
    `id` varchar(60) PRIMARY KEY NOT NULL,
    `title` varchar(255),
    `cat_id` varchar(40) not NULL,
    `user_id` varchar(40) not null,
    `amount` int,
    `note` varchar(255),
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted` datetime
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `transactions` ADD FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`);

ALTER TABLE `transactions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

https://robohash.org/odioexpeditapraesentium.png?size=50x50&set=set1
ALTER TABLE `transactions` ADD FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`);

---
-- dumping data into users table
---

insert into users (id, username, password, email, avatar, created, updated) values (1, 'aclash0', '120a63fa93a9ab3c0eb74947388f351c', 'ldagostino0@slate.com', 'https://robohash.org/utquiavoluptatibus.png?size=50x50&set=set1', '2022-02-15 19:54:20', '2022-05-02 07:59:20');
insert into users (id, username, password, email, avatar, created, updated) values (2, 'ggange1', '5d7dc30366d4b233457da872ad4c8de0', 'gwayte1@de.vu', 'https://robohash.org/repellatvoluptatemest.png?size=50x50&set=set1', '2022-02-27 22:20:47', '2022-04-25 04:17:09');
insert into users (id, username, password, email, avatar, created, updated) values (3, 'npeckitt2', 'e1c356f3137eb96738f483260601d086', 'mfossett2@odnoklassniki.ru', 'https://robohash.org/quoatdolorem.png?size=50x50&set=set1', '2022-03-09 03:11:53', '2022-04-26 10:02:41');
insert into users (id, username, password, email, avatar, created, updated) values (4, 'theake3', '0377ba6ddea9f6b60ff24ac2d2dd8df9', 'njerdein3@storify.com', 'https://robohash.org/autsuntculpa.png?size=50x50&set=set1', '2022-03-13 22:41:38', '2022-04-27 02:08:26');
insert into users (id, username, password, email, avatar, created, updated) values (5, 'smelendez4', '08a5c1c3307fbf70bc37e43d1365c5c0', 'cackeroyd4@arstechnica.com', 'https://robohash.org/esseabimpedit.png?size=50x50&set=set1', '2022-03-04 15:22:26', '2022-04-24 16:45:15');
insert into users (id, username, password, email, avatar, created, updated) values (6, 'mancliff5', '7467527f8af5a5f2c966744effec979d', 'tnawton5@pinterest.com', 'https://robohash.org/minimanonrerum.png?size=50x50&set=set1', '2022-02-25 04:55:22', '2022-04-29 03:08:10');
insert into users (id, username, password, email, avatar, created, updated) values (7, 'glunbech6', '4b331aeec684a028ee9ca2e58aee3600', 'acorish6@goo.ne.jp', 'https://robohash.org/autdistinctioitaque.png?size=50x50&set=set1', '2022-02-24 15:51:05', '2022-04-26 11:33:24');
insert into users (id, username, password, email, avatar, created, updated) values (8, 'hstanbrooke7', '89df435e33f2777ef231edbb78ba4e8c', 'yokeeffe7@craigslist.org', 'https://robohash.org/laborumlaboriosamrepellat.png?size=50x50&set=set1', '2022-02-23 10:20:54', '2022-05-02 22:04:44');
insert into users (id, username, password, email, avatar, created, updated) values (9, 'rfolshom8', '1970294768b5e740de29a6cd3f6f8885', 'dhenri8@devhub.com', 'https://robohash.org/eoslaudantiumcum.png?size=50x50&set=set1', '2022-03-13 09:14:42', '2022-04-18 11:26:47');
insert into users (id, username, password, email, avatar, created, updated) values (10, 'kfishburn9', 'ab485536e1fe6154c0774ed6a9e93d18', 'lpaolo9@cdc.gov', 'https://robohash.org/quiinciduntnumquam.png?size=50x50&set=set1', '2022-02-24 14:54:16', '2022-05-09 17:49:56');


---
-- dumping data into categories table
----
insert into categories (id, cat_name, is_expense, icon) values (1, 'Russia', true, 'https://robohash.org/minimasintincidunt.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (2, 'Cuba', true, 'https://robohash.org/evenietenimvoluptatem.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (3, 'Canada', false, 'https://robohash.org/omnisrepellatdolorem.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (4, 'China', true, 'https://robohash.org/corporisvoluptasexcepturi.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (5, 'Indonesia', false, 'https://robohash.org/culpavoluptatemtempora.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (6, 'Norway', false, 'https://robohash.org/voluptatumquoullam.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (7, 'Iran', false, 'https://robohash.org/excepturinisiexplicabo.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (8, 'China', true, 'https://robohash.org/autemautemanimi.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (9, 'Greece', false, 'https://robohash.org/excepturioditrerum.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (10, 'Japan', false, 'https://robohash.org/commodimagniconsequatur.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (11, 'Portugal', true, 'https://robohash.org/temporesuntsit.png?size=50x50&set=set1');
insert into categories (id, cat_name, is_expense, icon) values (12, 'Indonesia', false, 'https://robohash.org/impeditadipisciculpa.png?size=50x50&set=set1');


---
-- dumping data into transactions table
---

insert into transactions (id, title, cat_id, user_id, amount, note) values ('6e9d2820-bf6f-4215-bbbc-8058c3fce3cd', 'Chancay', '7ce4c1f3-fe3c-4ef4-877c-3cf380bff366', '57e7aca3-92ab-4c2a-bd48-439a5c8a1182', 2, 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.

Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.

Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('06daf48c-b977-42c1-9d8e-11f9c4173395', 'Cisitu', 'fdc223f1-e16e-460c-913b-0b0e1f6e14cd', '508923f6-0b0c-4b18-a0c8-9fa180d66315', 76, 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('cd52e32a-91be-46d1-bc91-ac65d17a1836', 'Medveđa', 'c3cab07e-2cd8-4431-be8b-d9785766aad7', '40a99072-e95c-4dd5-9b6a-09091e8525bd', 64, 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('1c2f10ba-a096-40a2-933a-13408ff63508', 'Jugezhuang', 'bf9a9808-6799-45d9-a700-5ce7f9ba419e', '3f0a57b1-8d04-4c12-8b52-de47efe53c7f', 96, 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.

Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.

In congue. Etiam justo. Etiam pretium iaculis justo.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('c704222a-7787-426b-bf89-9a4b46a0c0bb', 'Koson', '784e7ae8-9736-4e4f-9d84-724a6785ca78', '82f45df0-0214-49df-90df-50a0e797798e', 19, 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('19ff9f1d-f1e8-4d94-9d31-be22426a3233', 'Tögrög', 'db475115-c768-45fc-8446-c908e443e2a3', '299f4dfa-86c9-43d8-90fd-50bacaf9c848', 19, 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('502f2dd1-12e1-43e2-8ce1-5c8d32f11a82', 'Stamford', '47ec74c4-cb06-4dfa-b4e5-c276d347805c', '9d47f764-0a3e-4db5-a6d8-747d8b566899', 93, 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('846b812e-a28b-40a5-96ba-66fc43ba8f42', 'Sogati', '6fa1620e-16cb-43b9-a71f-16b8f02754ce', 'ef59457f-2cd2-4047-b6d3-9ef56390e1b1', 30, 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.

Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('203dbdd2-bdbd-4fba-b803-bfd0de044dd0', 'Melchor de Mencos', '9f331d32-2dea-4312-b24b-8f37c4f81670', '21f170b9-f8b4-4769-bbb9-10562e1f5221', 18, 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('917fb70e-0c73-4f29-9473-cb8e1ac8934c', 'Gómez', '6df7f956-e354-497c-905b-d38bf50b5192', '6a84028e-44c7-4302-ac1e-c858782c5f85', 14, 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('4ad37d65-4d57-4bb0-83fc-d9e6c699bc9a', 'Wanjia', 'b018d86f-9698-4696-a26b-bccde71f2ddb', 'ef3a7681-c2c6-4836-b22b-5d1502e8ec78', 28, 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('b004826a-4050-4ee9-abda-3cbc97890521', 'Konkwesso', 'f456c765-d4ff-4b97-93cf-044b6ccb324f', '31462f9a-fa12-48b9-830b-6711c3c8bd8a', 100, 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.

Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('6da9b182-ecd6-47e1-b9c0-d7c130f4046e', 'Hiratachō', '0741cc5c-86be-4677-8d3d-9e54f2ce3ad5', '34b29cfd-d59c-4f77-88e4-51a4bc81875e', 39, 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('40ea4d39-b6dc-46d5-9199-eec06a782d11', 'Daohe', '16bb3ce9-58d9-4781-8cdc-be10234c9f77', '823b4f0d-0391-4f54-977e-a354ac373ea5', 1, 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.

Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('ace773b2-4e61-43dd-9350-cf81300cd5c1', 'Dongfu', 'adc52585-0e64-4a27-b65c-758fedfc1628', '3cfa7d90-ed14-4c2e-a6af-db8a3095386c', 59, 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('cada08ef-3970-45a5-9903-5ce24a5513f2', 'Huyang', '633680cd-ddcb-414c-a88e-d677ecfa4ce4', 'b1accb98-147e-47cf-8b52-fab4b339c418', 79, 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('ff30196b-30a4-492a-a353-dbf354c99104', 'Guoduwan', 'cd6488bc-e1b5-47f1-983a-080ec8b73827', '9153fac6-4d19-4e33-970e-a33d6cda1e0c', 94, 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.

Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('548ddfd2-4ea2-46b7-a50f-918be1bdb217', 'Florida', '50985e09-906e-4460-8a46-12d21ffd04c3', '9bfa93ad-869d-4878-b40d-08434e1b0a89', 17, 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.

Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('c68a0fc9-fed7-4326-9d4a-36b576188f4a', 'Starobelokurikha', 'd6b4b69f-78bb-4003-9ea0-1aa1b176c046', 'c4c95466-fcbe-4197-8027-2887cb9b34d9', 74, 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('7cbb73da-8eea-4f8b-8558-61f58b39d394', 'Springfield', '7a1b8a0a-2d69-4cbb-8bfe-ff8f55cabbbb', '7f764976-6ccb-442e-9a81-68099ee12cd8', 79, 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.

Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('8256b72e-7b7b-4544-b391-8a2ec088cfc5', 'Virje', 'ce3ce7c6-2bd8-4bf5-9471-774c4b6fd8b3', '2bfeb9c6-cb4a-4328-9a41-b712b7a234c9', 42, 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('3c86e986-46fe-4ae8-968f-d80fdd947cec', 'Béré', '4913feb3-e9b9-413c-8cf1-6037bcd7f798', '6cd34cb0-5174-462f-a759-33e9d98fa2dc', 14, 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.

Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.

Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('eac68a0f-85e9-41d7-a8ba-f2e4c403f9c6', 'Umm al Qaywayn', '293e8142-99aa-49db-9a8b-54c906e71113', '4e84d96a-8bae-4689-b683-ee3e6e9ba3a7', 79, 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('99fb097c-69e1-41d5-8df9-ce5ddbc85ef2', 'Penang', 'bda04e61-3bfc-4a4e-a3be-d5ab38e70fb3', '76d198f5-acc3-416a-bb06-c401420597bb', 81, 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.

Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.

Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('49001d5c-4749-4a09-873f-25cd8ab18725', 'Giyon', 'f3438da6-e3dd-48dc-87cc-2550a02cf469', '9555d3b4-55cc-4a04-a699-d6fd5ea80159', 11, 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('62337cc4-1cab-4494-84c0-db8fe261ed3c', 'Cluny', 'c1a979a1-8fce-4dd1-8ba8-64e2fffed057', '5d1bc4fa-45b5-4323-873a-5f3d29231499', 10, 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.

Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('dcec11a7-552b-4e2b-8a76-6a04abbcc44c', 'Candelária', '37edef7a-98d1-458d-b92c-2e29070f1f4c', '6e4f5b4c-1a91-4fdb-81b3-02745f6c3121', 52, 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.

Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.

Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('ec80b620-f30b-4ae1-acee-f8b79cb22cdb', 'Pizarro', '438981f7-ad7e-4d6f-8d65-ea6d92f42883', '645b81f3-c495-4e08-a43c-f16fe0757842', 23, 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.

Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('79090856-a9d5-4657-81fd-6914968b8d1c', 'Ligang', 'b045dd1f-cea7-4cd6-9f73-0c54ba419420', '37fbfe28-2604-4b08-a4c5-09f54f8fe4b9', 75, 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('310690e8-6706-45cb-8812-248253415bae', 'Cihaladan', '91ee9885-f0bc-4379-850b-e25831f25461', 'ac1d7efc-0d5d-460b-ba01-0a76881e1370', 94, 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('ab78cdea-bfd2-4bd2-b023-0d2dafaa346b', 'Karpinsk', '0f0050e1-06c3-4821-9213-964ef93f7641', 'a19a304d-b4a8-4419-a7b2-0a47beb14ead', 35, 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.

Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('503a1d85-42b3-4993-a203-125f15fe8867', 'Sansanné-Mango', 'c4e50695-69cd-4e6b-8eb6-32474fa98c56', 'cc005cb4-5a3d-4c79-8283-b47a1b5c7866', 97, 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.

Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('68f18bd1-1d39-4be4-85ab-81f44a85fd6f', 'Majayjay', '0aa93e74-4fc4-45cf-b337-39b9f0260bb5', '04af979c-69c2-490e-8c8b-012f4db08475', 12, 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.

Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.

Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('1a6faf69-aadf-47f5-8e83-c06499e481bd', 'Shizuishan', '6c92f766-1a0a-4c6f-b532-411029d3b027', '96df379d-0b21-43c8-9185-9be7dd7ec52d', 69, 'Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('51c50569-e991-4a37-a797-d9ded70ef05c', 'Douentza', 'a060d8db-5d1c-4a6d-8cce-cba1244a6f44', 'c1f3c632-be6b-4882-beb2-9ab02d4e3393', 63, 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('439ec23a-de5f-42e6-b4cc-5d03d2889627', 'Žiežmariai', '5ff974a9-6df2-48ef-8f17-b771a60064d1', 'ed3f6e41-2688-40da-bd24-dbf74c52b7bc', 30, 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.

Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('a67a11d9-7d02-42b4-8c83-d9222005f2a0', 'Dongbang', 'f133f7bd-6f6a-45b6-a412-6793af156d57', '4f0e6227-887b-4701-99ba-f4f4319b5b26', 30, 'Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('7c9e4b17-afa7-49bf-a1d2-36c9bc9c7a80', 'San', 'aed349f3-0a56-445e-9add-ad50926dec71', '2fd10268-165c-4de9-9529-e9a1abf584c9', 5, 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('83ec4615-5534-4672-96d9-3959ee653236', 'Bogorodskoye', '6fcf5fe4-ad30-41b8-a411-ce5a2ee4892b', '21c95be5-0aeb-48ee-8ab4-fdb68f71f5db', 10, 'Fusce consequat. Nulla nisl. Nunc nisl.

Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('3a49eaba-7f06-49a6-8198-a57185d6036d', 'San Isidro', '0f428464-8e56-43e6-ba27-960a50001425', 'd0b3e319-15fc-4b36-ac1f-e6935e906d3c', 81, 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.

Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('dce9b2f7-5c81-49c8-9308-92e273a4c2ef', 'Kadubamban', 'a71d451d-2777-4796-a4e3-917ece0d9b4b', 'fab4d798-b397-490f-a850-c80c0b321045', 16, 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.

Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('e59013de-c693-41e1-b22d-31b373c2684e', 'Dolní Černilov', 'b4beb8c6-51e7-48b7-911e-7a5a91af29a6', '454dccf0-1adb-4cab-b236-7ce069c49f13', 97, 'Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.');
insert into transactions (id, title, cat_id, user_id, amount, note) values ('8b0127bb-9018-43ea-be07-dbbaacf76593', 'Oak Bay', 'a3554837-8d0f-4218-835b-d9207dba8449', '77c92970-0524-48e1-88d4-a5d319060a3e', 74, 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.');
