/* Study notes. Wording follows the slides of
   "Cloud Databases and Data Services: Volume 1 & Volume 2" (CSELC01C - Cloud Computing Development).
   **text** = key word (hidden in Recall mode). sl = "volume·slide". */
(self.D=self.D||{});
D.TOPICS={
 a:{name:"Understanding Application Data",short:"Application Data",icon:"☁️",vol:1,part:"Volume 1 · Part 1",slides:"Slides 3–17"},
 b:{name:"Database Models",short:"Database Models",icon:"🗂️",vol:1,part:"Volume 1 · Part 2",slides:"Slides 18–36"},
 c:{name:"Using Databases in Applications",short:"Using Databases",icon:"🔌",vol:1,part:"Volume 1 · Part 3",slides:"Slides 37–56"},
 d:{name:"Protecting and Maintaining Cloud Databases",short:"Protecting Databases",icon:"🔒",vol:2,part:"Volume 2 · Part 1",slides:"Slides 3–14"},
 e:{name:"Cloud Storage",short:"Cloud Storage",icon:"🪣",vol:2,part:"Volume 2 · Part 2",slides:"Slides 15–24"}
};
D.NOTES={
a:[
{h:"Why Applications Need Data",sl:"1·4–6",b:`
<ul>
<li>Most applications need to store information so that it can be **used again** after an individual interaction or program execution ends.</li>
<li>Applications may need to store information about **users, products, transactions, messages, settings**, or other activities.</li>
<li>Without **persistent storage**, information held only in **application memory** may disappear when the application stops or restarts.</li>
<li>A **database** provides a structured way for applications to **store, organize, retrieve, and manage** persistent information.</li>
<li>Databases therefore serve as an important **source of information** for many modern applications.</li>
</ul>
<h4>Memory vs. persistent data</h4>
<ul>
<li>An application can temporarily keep information in **memory**, but that memory is primarily intended for data needed **while the program is running**.</li>
<li>**Persistent data** must remain available after the **application process ends**, the **server restarts**, or a **user disconnects**.</li>
<li>Databases provide **persistent storage** that applications can access **repeatedly**.</li>
<li>Persistent data can also be **shared** among multiple users, application instances, and other systems.</li>
<li>This allows an application's information to become a **continuing part of the system** rather than something that exists only during one execution.</li>
</ul>
<div class="ex"><b>Example — an online store</b><br>During one request: <code>Product = "Laptop"</code>, <code>Quantity = 2</code> → may exist <b>temporarily in application memory</b>.<br>But <b>Customer, Product, Order, Payment, Shipping Address</b> → must normally be <b>stored persistently</b> so it can be retrieved later.</div>`},
{h:"What Does a Database Provide?",sl:"1·7",b:`
<p>A database does more than simply **keep files**. It provides mechanisms for:</p>
<table class="t"><tr><th>Mechanism</th><th>Meaning (slide wording)</th></tr>
<tr><td>**Storage**</td><td>keeping information persistently.</td></tr>
<tr><td>**Organization**</td><td>arranging information into structures that can be managed efficiently.</td></tr>
<tr><td>**Retrieval**</td><td>finding specific information when an application requests it.</td></tr>
<tr><td>**Modification**</td><td>adding, changing, and removing information.</td></tr>
<tr><td>**Consistency**</td><td>helping maintain valid and reliable data.</td></tr>
<tr><td>**Controlled access**</td><td>determining who or what can access the information.</td></tr></table>
<div class="hook">🧠 <b>S-O-R-M-C-C</b> → “<b>S</b>ome <b>O</b>ld <b>R</b>obots <b>M</b>ake <b>C</b>ool <b>C</b>offee” — Storage, Organization, Retrieval, Modification, Consistency, Controlled access.</div>
<ul><li>A **database management system (DBMS)** provides the **software mechanisms** that allow applications and users to interact with stored data.</li></ul>`},
{h:"Application, Database, and Users",sl:"1·8",b:`
<ul><li>A typical application does **not** allow users to communicate **directly** with the database.</li>
<li>Instead, **the application acts as an intermediary**.</li></ul>
<div class="flow"><span class="n u">User</span><span class="ar">request →<br>← present</span><span class="n ap">Application</span><span class="ar">query →<br>← information</span><span class="n db">Database</span></div>
<ol><li>The user interacts with the application's **interface**.</li>
<li>The application determines what **information is needed**.</li>
<li>The application sends an appropriate **request** to the database.</li>
<li>The database **processes the request** and returns the requested information.</li>
<li>The application then **presents the result** to the user.</li></ol>
<ul><li>This arrangement also allows the application to enforce **validation, authorization, and business rules** before data reaches the database.</li></ul>`},
{h:"What Is a Cloud Database?",sl:"1·9–10",b:`
<ul>
<li>A **cloud database** is a database that is **deployed, delivered, and accessed** through a **cloud environment**.</li>
<li>It provides the same fundamental purpose as a **traditional database**: storing, organizing, managing, and retrieving application data.</li>
<li>Cloud databases can support **structured, semi-structured, and unstructured** data, depending on the **database technology**.</li>
<li>They can be deployed on cloud infrastructure as **self-managed** databases or provided as **managed services**.</li>
<li>Cloud databases can take advantage of cloud capabilities such as **scalability, remote accessibility, automation, and flexible resource provisioning**.</li>
</ul>
<div class="trap">⚠️ A cloud database does <b>not automatically</b> mean that the cloud provider manages everything.</div>
<p>There are <b>two broad approaches</b> for Cloud Database Deployment:</p>
<div class="two"><div class="box"><h5>**Self-Managed Cloud Database**</h5><ul><li>The database is installed on a **cloud virtual machine** or other infrastructure.</li><li>The **organization** remains responsible for much of the database administration.</li><li>The organization may manage the **operating system, database software, updates, backups, and configuration**.</li></ul></div>
<div class="box"><h5>**Managed Cloud Database**</h5><ul><li>The **cloud provider** operates the underlying database infrastructure.</li><li>Many **routine administrative tasks** are handled by the provider.</li><li>The development team primarily focuses on **using the database** for the application.</li></ul></div></div>`},
{h:"Why Use Cloud Databases?",sl:"1·11",b:`
<p>Cloud databases can provide several advantages for application development:</p>
<table class="t"><tr><th>Advantage</th><th>Meaning</th></tr>
<tr><td>**Scalability**</td><td>resources can be adjusted as application workloads change.</td></tr>
<tr><td>**Agility**</td><td>databases can often be provisioned more quickly than traditional physical infrastructure.</td></tr>
<tr><td>**Reduced infrastructure management**</td><td>managed services can remove many hardware and maintenance responsibilities.</td></tr>
<tr><td>**Accessibility**</td><td>applications and authorized developers can access cloud resources through network connections.</td></tr>
<tr><td>**Reliability**</td><td>cloud platforms may provide features such as automated backups, replication, and high-availability configurations.</td></tr>
<tr><td>**Flexible costs**</td><td>many cloud services use usage-based or resource-based pricing models.</td></tr></table>
<div class="hook">🧠 <b>S-A-R-A-R-F</b> → “<b>S</b>ky <b>A</b>nd <b>R</b>ain <b>A</b>re <b>R</b>eally <b>F</b>resh” — Scalability, Agility, Reduced infrastructure management, Accessibility, Reliability, Flexible costs.</div>
<div class="trap">⚠️ <b>Important clarification:</b> These are <b>potential advantages, not guarantees</b>. A poorly designed cloud database can still become <b>expensive, insecure, unavailable, difficult to migrate, or difficult to integrate</b>.</div>`},
{h:"Database as a Service (DBaaS)",sl:"1·12",b:`
<ul><li>**Database as a Service (DBaaS)** is a **cloud service model** in which a provider delivers database capabilities while managing much of the **underlying infrastructure and administrative work**.</li></ul>
<p>Instead of manually building the database environment, the developer can typically:</p>
<ol><li>**Select** a database service.</li><li>**Configure** the required resources.</li><li>**Create** the database.</li><li>**Obtain** connection information.</li><li>**Connect** the application.</li><li>**Manage** the data and application-level configuration.</li></ol>
<div class="hook">🧠 Order: <b>Select → Configure → Create → Obtain → Connect → Manage</b> — “<b>S</b>ome <b>C</b>louds <b>C</b>arry <b>O</b>ur <b>C</b>ity's <b>M</b>ist”.</div>
<ul><li>The **provider** handles many underlying operational responsibilities.</li></ul>`},
{h:"Self-Managed Database vs. DBaaS",sl:"1·13",b:`
<div class="two"><div class="box"><h5>Self-Managed</h5><p><b>Developer / Organization:</b> Application, Database, Database Configuration, **Updates**, **Backups**, **Maintenance**</p><p><b>Cloud Provider:</b> **Infrastructure** only</p></div>
<div class="box"><h5>DBaaS</h5><p><b>Developer / Organization:</b> Application, **Data**, **Queries**, Database Configuration</p><p><b>DBaaS Provider:</b> Infrastructure, **Provisioning**, **Patching**, Backups, Maintenance</p></div></div>
<div class="hook">🧠 In <b>both</b>, the developer keeps <b>Application</b> and <b>Database Configuration</b>. In DBaaS, <b>Updates/Backups/Maintenance</b> move to the provider.</div>`},
{h:"What Does a DBaaS Provider Manage?",sl:"1·14",b:`
<div class="two"><div class="box"><h5>CLOUD PROVIDER</h5><p>Infrastructure · Hardware · OS / Platform · Database Maintenance · Backups · Patching · Availability</p></div>
<div class="box"><h5>APPLICATION TEAM</h5><p>**Application Code** · **Data Model** · **Queries** · **Access Rules** · **Application Security**</p></div></div>
<ul><li>A **managed database service** can **automate** many repetitive infrastructure and administration tasks.</li>
<li>Depending on the service, these can include: Database provisioning, Hardware provisioning, Software installation, Software patching, Automated backups, Monitoring, Failure detection, Recovery, Scaling, High-availability mechanisms.</li>
<li>For example, **Amazon RDS** automates provisioning, configuration, backups, patching, monitoring, and other database management tasks.</li>
<li>DBaaS shifts many **infrastructure and database administration responsibilities** to the cloud provider. However, the **application developer** remains responsible for how the application uses the database and how data is protected at the **application level**.</li></ul>`},
{h:"Examples of DBaaS",sl:"1·15",b:`
<ul><li>DBaaS is **not a single database technology**. Different providers offer managed services for different database engines and data models.</li></ul>
<div class="two"><div class="box"><h5>Relational</h5><p>**Amazon RDS** · **Google Cloud SQL** · **Azure SQL Database**</p></div>
<div class="box"><h5>NoSQL / Non-relational</h5><p>**Amazon DynamoDB** · **Google Firestore** · **Azure Cosmos DB** · **MongoDB Atlas**</p></div></div>
<ul><li>The specific capabilities and management responsibilities **vary** between services.</li>
<li>Amazon RDS supports several familiar relational database engines including **PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, and Db2**.</li>
<li>Google Cloud similarly offers managed relational and non-relational database services, including **Cloud SQL, Spanner, Bigtable, Firestore**, and others.</li></ul>
<div class="trap">⚠️ Spelling to watch: <b>DBaaS</b> (two small “a”s), <b>DynamoDB</b>, <b>Cosmos DB</b>, <b>MongoDB Atlas</b>, <b>Db2</b> (small “b”).</div>`},
{h:"Benefits and Considerations of DBaaS",sl:"1·16–17",b:`
<div class="two"><div class="box"><h5>✅ Benefits of DBaaS</h5><ul><li>Reduces **infrastructure administration**.</li><li>Allows databases to be **provisioned quickly**.</li><li>Provides access to **automated maintenance** features.</li><li>Can simplify **backup and recovery**.</li><li>Can provide **scalability and high-availability** features.</li><li>Allows developers to focus more heavily on **application development**.</li></ul></div>
<div class="box"><h5>⚠️ Considerations of DBaaS</h5><ul><li>**Costs** can increase as usage and resources grow.</li><li>Applications may become dependent on **provider-specific features**.</li><li>**Migration** to another provider may require additional work.</li><li>Database configuration options may be **more restricted** than with a completely self-managed system.</li><li>The provider does **not automatically** make the application **secure or well-designed**.</li></ul></div></div>`}
],
b:[
{h:"What Is a Relational Database?",sl:"1·19–21",b:`
<ul><li>A **relational database** organizes data into collections of **tables**.</li>
<li>Each table represents a particular type of information, such as customers, products, employees, or orders.</li>
<li>A table consists of **rows and columns**.</li>
<li>Each **row** generally represents one **record** or **instance** of the entity being stored.</li>
<li>Each **column** represents an **attribute** or **property** of those records.</li>
<li>**Relationships** between tables allow related information to be connected without placing everything into a single table.</li>
<li>A relational database represents information using a **structured table format**.</li></ul>
<table class="t"><tr><th>TABLE</th><th>ROW</th><th>COLUMN</th></tr>
<tr><td>A table represents a particular **entity or subject**.<br><small>e.g., Customers, Products, Employees, Orders, Courses</small></td><td>A row represents **one individual record**.<br><small>e.g., one row in a Customers table can represent one customer</small></td><td>A column represents an **attribute** of the records.<br><small>e.g., Customer ID, Name, Email, and Phone</small></td></tr></table>
<h4>Primary key</h4>
<ul><li>A relational table commonly uses a **primary key** to **uniquely identify** each record.</li>
<li>A primary key contains a value that uniquely identifies a **row**.</li>
<li>Two records in the same table should **not** have the same primary-key value.</li>
<li>A primary key allows applications to refer to a specific record **reliably**.</li>
<li>Primary keys are often **numeric identifiers**, but they can use other appropriate data types.</li>
<li>A primary key can also be used when establishing **relationships** with other tables.</li></ul>`},
{h:"Relationships Between Tables",sl:"1·22",b:`
<ul><li>One of the major strengths of the relational model is its ability to represent **relationships between different types of information**.</li></ul>
<table class="t"><tr><th>Relationship type</th><th>Meaning</th></tr>
<tr><td>**One-to-one**</td><td>one record corresponds to one other record.</td></tr>
<tr><td>**One-to-many**</td><td>one record can be associated with many records.</td></tr>
<tr><td>**Many-to-many**</td><td>many records can be associated with many other records.</td></tr></table>
<div class="ex">Slide 27 diagram: <b>Customers</b> (CustID PK) <b>1 : N</b> → <b>Orders</b> (OrdID PK, CustID FK) <b>N : M</b> → <b>Products</b> (ProdID PK).</div>`},
{h:"Why Use a Relational Database?",sl:"1·23",b:`
<p>Relational databases are particularly useful when applications require:</p>
<ul><li>Clearly **structured data**.</li><li>**Relationships** between different entities.</li><li>Reliable **transactions**.</li><li>**Consistent** data.</li><li>**Complex queries** involving multiple tables.</li><li>**Strong rules** governing how information is stored.</li></ul>
<ul><li>Relational databases remain widely used because many business applications involve **structured information and relationships** that benefit from **strong consistency** and **well-defined schemas**.</li></ul>`},
{h:"What Is SQL?",sl:"1·24–25",b:`
<ul><li>**SQL**, or **Structured Query Language**, is a **language** used to interact with **relational databases**.</li></ul>
<p>SQL can be used to:</p>
<ul><li>Create database structures.</li><li>Retrieve information.</li><li>Insert new records.</li><li>Modify existing records.</li><li>Delete records.</li><li>Filter and sort results.</li><li>Combine information from multiple tables.</li><li>Control certain aspects of database access.</li></ul>
<div class="trap">⚠️ SQL is therefore <b>not itself a database</b>, but is a <b>language</b> used to communicate with relational database systems.</div>
<p>Examples of relational database systems that support SQL: **PostgreSQL**, **MySQL**, **MariaDB**, **Microsoft SQL Server**, **Oracle Database**, **SQLite**.</p>`},
{h:"SQL and CRUD",sl:"1·26",b:`
<p>SQL provides commands that correspond to the four fundamental data operations known as **CRUD**:</p>
<table class="t"><tr><th>CRUD</th><th>SQL Operation</th><th>Purpose</th></tr>
<tr><td>Create</td><td>**INSERT**</td><td>Add data</td></tr>
<tr><td>Read</td><td>**SELECT**</td><td>Retrieve data</td></tr>
<tr><td>Update</td><td>**UPDATE**</td><td>Modify data</td></tr>
<tr><td>Delete</td><td>**DELETE**</td><td>Remove data</td></tr></table>
<div class="trap">⚠️ Trap: <b>Create = INSERT</b> (not “CREATE”), <b>Read = SELECT</b> (not “READ”). Only Update and Delete keep the same word.</div>
<ul><li>The application can use SQL to perform these operations against the database.</li>
<li>CRUD describes **what the application wants to do with data**, while SQL provides **one way to express those operations** for relational databases.</li></ul>`},
{h:"SQL and Relationships",sl:"1·27",b:`
<ul><li>SQL becomes particularly powerful when information is distributed across **multiple related tables**.</li>
<li>SQL can combine information from these tables using operations such as **JOIN**.</li></ul>
<pre>SELECT custname, orders.ordid, prodname
FROM customers
JOIN orders   ON custid = orders.custid
JOIN products ON orders.prodid = prodid;</pre>
<ul><li>This allows an application to retrieve **related information** even when that information is stored in **different tables**.</li></ul>`},
{h:"SQL Database Examples",sl:"1·28",b:`
<p>There are many SQL-based database systems, but they are **not all identical**.</p>
<table class="t"><tr><th>System</th><th>Key points</th></tr>
<tr><td>**PostgreSQL**</td><td>Open-source relational database. Known for **advanced SQL capabilities and extensibility**. Widely used in web and cloud applications.</td></tr>
<tr><td>**MySQL**</td><td>**Popular** open-source relational database. Commonly used in web applications. Widely supported by **hosting platforms**.</td></tr>
<tr><td>**Microsoft SQL Server**</td><td>Microsoft's relational database platform. Common in **enterprise environments**. Integrates closely with **Microsoft technologies**.</td></tr>
<tr><td>**SQLite**</td><td>**Lightweight embedded** relational database. Stores the database **in a file**. Common in **mobile, desktop, and small applications**.</td></tr>
<tr><td>**Oracle Database**</td><td>Enterprise relational database platform. Designed for **large-scale business workloads**.</td></tr></table>
<div class="hook">🧠 PostgreSQL = <b>advanced + extensible</b> · MySQL = <b>popular + hosting</b> · SQL Server = <b>Microsoft</b> · SQLite = <b>“lite” → file, mobile</b> · Oracle = <b>large-scale business</b>.</div>`},
{h:"NoSQL Databases",sl:"1·29",b:`
<ul><li>**NoSQL** refers broadly to database technologies that **do not rely exclusively** on the traditional **relational table model**.</li></ul>
<p>The term is commonly associated with databases designed for:</p>
<ul><li>Flexible data structures.</li><li>Large-scale distributed applications.</li><li>High-volume workloads.</li><li>Rapidly changing application requirements.</li><li>Data that does not naturally fit into rigid tables.</li></ul>
<div class="trap">⚠️ NoSQL does <b>not</b> mean “databases that cannot use SQL.” Modern NoSQL systems use <b>different data models and query mechanisms</b> depending on the database.</div>
<p>Common categories: **Document** databases · **Key-value** databases · **Wide-column** databases · **Graph** databases</p>
<div class="hook">🧠 <b>D-K-W-G</b> → “<b>D</b>on't <b>K</b>eep <b>W</b>et <b>G</b>loves”.</div>`},
{h:"The Four NoSQL Categories",sl:"1·30–33",b:`
<div class="box"><h5>📄 Document database <small>(slide 30)</small></h5><ul><li>Stores information as **documents** rather than traditional rows and columns.</li><li>Documents commonly use formats similar to **JSON**.</li><li>Examples: **MongoDB**, **Google Firestore**, **Couchbase**.</li><li>This flexible structure can be useful when application data **changes frequently** or when information naturally resembles **nested documents**.</li></ul></div>
<div class="box"><h5>🔑 Key-value database <small>(slide 31)</small></h5><ul><li>Stores information as **pairs** consisting of a **unique key** and an **associated value**. <code>user:101 → "Maria Santos"</code></li><li>The application uses the **key** to retrieve the associated value.</li><li>Particularly useful when applications need **extremely fast access** to information using a **known identifier**.</li><li>Common use cases: **caching, session management, shopping carts, user preferences, real-time applications** and more.</li><li>Examples: **Amazon DynamoDB**, **Redis**, **Amazon ElastiCache**.</li></ul></div>
<div class="box"><h5>🧱 Wide-column database <small>(slide 32)</small></h5><ul><li>Organize information around **rows and column families**.</li><li>Often used for **large-scale distributed data, high-volume workloads, and analytical or operational systems**.</li><li>Examples: **Apache Cassandra**, **Google Cloud Bigtable**.</li></ul></div>
<div class="box"><h5>🕸️ Graph database <small>(slide 33)</small></h5><ul><li>Represent information using **nodes and relationships**.</li><li>Useful for **social networks, recommendation systems, fraud detection, network analysis**, and more.</li><li>Example: **Neo4j**.</li></ul></div>
<div class="trap">⚠️ <b>Google Firestore</b> = Document · <b>Google Cloud Bigtable</b> = Wide-column · <b>Amazon DynamoDB</b> = Key-value · <b>Neo4j</b> = Graph. Don't mix them up!</div>`},
{h:"Why Use NoSQL?",sl:"1·34",b:`
<p>NoSQL databases can be advantageous when applications require:</p>
<ul><li>Flexible or rapidly changing **data structures**.</li><li>Large-scale **distributed storage**.</li><li>**High-volume** read or write operations.</li><li>Data models that do not naturally fit **relational tables**.</li><li>**Horizontal scaling** across multiple machines.</li><li>Application-specific **data access patterns**.</li></ul>
<ul><li>NoSQL databases are commonly associated with modern web applications, distributed systems, real-time services, content platforms, and large-scale data workloads.</li></ul>
<div class="trap">⚠️ However, NoSQL does <b>not automatically</b> mean <b>faster, better, or more scalable</b>. The appropriate database depends on the <b>application's requirements</b>.</div>`},
{h:"SQL vs NoSQL Comparison",sl:"1·35",b:`
<table class="t"><tr><th>Characteristic</th><th>SQL</th><th>NoSQL</th></tr>
<tr><td>Data model</td><td>**Relational tables**</td><td>Document, key-value, graph, wide-column, etc.</td></tr>
<tr><td>Schema</td><td>**Usually structured**</td><td>**Often more flexible**</td></tr>
<tr><td>Relationships</td><td>**Strong support**</td><td>**Depends on database type**</td></tr>
<tr><td>Query language</td><td>SQL</td><td>**Database-specific mechanisms**</td></tr>
<tr><td>Transactions</td><td>**Strong transactional support**</td><td>**Varies by system**</td></tr>
<tr><td>Scaling</td><td>Traditionally **vertical**; horizontal options exist</td><td>Often designed with **distributed scaling** in mind</td></tr>
<tr><td>Best suited for</td><td>Structured, relational data</td><td>Flexible or specialized data models</td></tr></table>
<ul><li>These are **general tendencies, not absolute rules**.</li>
<li>Modern SQL databases can support **JSON, distributed architectures, and horizontal scaling**.</li>
<li>Modern NoSQL databases can also provide **transactions and strong consistency**.</li>
<li>The distinction is therefore becoming less about simple technical limitations and more about **design priorities and application requirements**.</li></ul>`},
{h:"There Is No Universal “Best” Database",sl:"1·36",b:`
<ul><li>Choosing between SQL and NoSQL should begin with **application requirements**, not **popularity**.</li></ul>
<p>Developers should consider:</p>
<ul><li>What kind of data will be stored?</li><li>How are relationships represented?</li><li>How will the application query the data?</li><li>How frequently will the data change?</li><li>How important are transactions?</li><li>How much data is expected?</li><li>What scalability requirements exist?</li><li>What consistency requirements exist?</li><li>What cloud services are available?</li><li>What skills does the development team have?</li></ul>
<div class="hook">🧠 Choose the database model that <b>fits the application's data and workload</b> — not the database that happens to be the <b>most popular</b>.</div>`}
],
c:[
{h:"What Is a Managed Database Service?",sl:"1·38–39",b:`
<ul><li>A **managed database service** is a cloud service in which the **cloud provider operates and maintains** much of the underlying database infrastructure.</li>
<li>Instead of installing and maintaining database software on their own servers, developers can **provision** a database through the cloud provider.</li></ul>
<p>The provider may handle tasks such as: Database server provisioning · Software installation · Hardware maintenance · Storage management · Automated backups · Patching and updates · Monitoring · Availability features</p>
<ul><li>The **development team** remains responsible for the **application and its data**, while the provider manages much of the underlying infrastructure.</li>
<li>Managed database services reduce the amount of **infrastructure work** required from application developers.</li></ul>
<p>Instead of configuring database servers, developers can focus on: **Application functionality, Data models, Queries, Security rules, Performance, User experience**.</p>
<p>Managed services can also provide cloud features such as: Automated backups · Monitoring · Replication · Scaling options · High availability · Security controls</p>
<ul><li>This makes managed databases particularly useful for teams that need a database **without becoming responsible for every aspect** of its underlying infrastructure.</li></ul>`},
{h:"Managed Database Products by Provider",sl:"1·40",b:`
<p>Major cloud providers offer managed database products for both **relational and NoSQL** workloads.</p>
<table class="t"><tr><th>Amazon Web Services</th><th>Microsoft Azure</th><th>Google Cloud</th></tr>
<tr><td>Amazon RDS<br>Amazon Aurora<br>Amazon DynamoDB</td><td>Azure SQL Database<br>Azure Database for PostgreSQL<br>Azure Cosmos DB</td><td>Cloud SQL<br>AlloyDB<br>Firestore<br>Cloud Spanner</td></tr></table>
<ul><li>These services differ in **database engine, architecture, scalability, pricing, and management features**.</li>
<li>The developer therefore still needs to **select an appropriate service** based on application requirements.</li></ul>
<div class="hook">🧠 AWS has 3, Azure has 3, Google Cloud has 4 (Cloud SQL, AlloyDB, Firestore, Cloud Spanner).</div>`},
{h:"Self-Managed vs Managed Service",sl:"1·41",b:`
<table class="t"><tr><th>Self-Managed</th><th>Managed Service</th></tr>
<tr><td>Developer **installs** database</td><td>Provider **provisions** database</td></tr>
<tr><td>Developer manages **server**</td><td>Provider manages **infrastructure**</td></tr>
<tr><td>Developer handles many **updates**</td><td>Provider handles many **maintenance tasks**</td></tr>
<tr><td>Developer manages **backups**</td><td>**Automated backup options** available</td></tr>
<tr><td>**More** infrastructure responsibility</td><td>**Less** infrastructure responsibility</td></tr>
<tr><td>**Greater configuration control**</td><td>**Provider-defined service constraints**</td></tr></table>
<div class="trap">⚠️ <b>Neither approach is automatically better.</b> A self-managed database can provide <b>greater control</b>, while a managed service can reduce <b>operational overhead</b>.</div>
<ul><li>Managed services shift **operational responsibility** toward the cloud provider, allowing developers to concentrate more heavily on the application itself.</li></ul>`},
{h:"The Application–Database Relationship",sl:"1·42–45",b:`
<ul><li>A database normally does **not operate independently** from the application that uses it.</li>
<li>The application acts as an **intermediary** between users and the database.</li></ul>
<p>Example — registration:</p>
<ol><li>A user submits a registration form.</li><li>The application **receives** the information.</li><li>The application **validates** the submitted data.</li><li>The application sends a **database operation**.</li><li>The database **stores** the information.</li><li>The application returns an appropriate **response**.</li></ol>
<ul><li>This separation allows the database to remain **protected from direct user access**.</li></ul>
<h4>Connection information</h4>
<ul><li>An application needs **connection information** to communicate with a database. Depending on the database system, this can include: **Database host, Port, Database name, Username, Password, Authentication information, Connection options**.</li>
<li>A **connection string** can combine several of these values. Example: <code>postgresql://username:password@host:5432/database</code></li>
<li>The application uses this information to **establish a connection** with the database.</li>
<li>Connection information should not normally be placed directly into **public frontend code**.</li></ul>
<h4>Request layers</h4>
<div class="flow v"><span class="n u">USER</span><span class="ar">Request ↓ ↑ Result</span><span class="n fe">FRONTEND</span><span class="ar">HTTP Request ↓ ↑ Result</span><span class="n ap">BACKEND / API</span><span class="ar">Database Query ↓ ↑ Result</span><span class="n db">DATABASE</span></div>
<ul><li>The **frontend** generally should **not connect directly to a private database**.</li>
<li>Instead, the **backend** controls how the application interacts with stored information.</li></ul>`},
{h:"Database Drivers and Libraries",sl:"1·46",b:`
<ul><li>Applications normally communicate with databases through a **database driver, client library, or framework integration**.</li></ul>
<table class="t"><tr><th>Application</th><th>Uses</th></tr>
<tr><td>Python applications</td><td>→ **PostgreSQL or MySQL drivers**</td></tr>
<tr><td>Node.js applications</td><td>→ **database packages**</td></tr>
<tr><td>Java applications</td><td>→ **JDBC**</td></tr>
<tr><td>.NET applications</td><td>→ **database providers**</td></tr>
<tr><td>PHP applications</td><td>→ **database extensions**</td></tr></table>
<div class="hook">🧠 “<b>P</b>ython <b>D</b>rives, <b>N</b>ode <b>P</b>ackages, <b>J</b>ava <b>J</b>DBC, .<b>N</b>ET <b>P</b>roviders, <b>P</b>HP <b>E</b>xtensions.”</div>
<p>An application can use these libraries to: **Open** connections · **Send** queries · **Provide** parameters · **Retrieve** results · **Handle** database errors · **Close or manage** connections.</p>
<ul><li>The exact programming interface depends on the **programming language and database system** being used.</li></ul>`},
{h:"Connection Pooling",sl:"1·47",b:`
<ul><li>Cloud applications may receive many database requests.</li>
<li>Opening a completely new database connection for every request can create **unnecessary overhead**.</li>
<li>**Connection pooling** allows an application to maintain a collection of **reusable database connections**.</li>
<li>When an operation is needed, the application can **temporarily use** an available connection and **return it to the pool** afterward.</li>
<li>Connection pooling can improve application **efficiency** and reduce the **overhead** associated with repeatedly establishing connections.</li></ul>
<div class="flow v"><span class="n ap">APPLICATION</span><span class="ar">user A · user B · user C · user D</span><span class="n pool">CONNECTION POOL [1][2][3][4]</span><span class="ar">conn1 · conn2 · conn3 · conn4</span><span class="n db">DATABASE</span></div>`},
{h:"Database Credentials",sl:"1·48–49",b:`
<ul><li>**Database credentials** are **authentication details** used to verify that an application or user is **authorized** to access a database.</li></ul>
<p>Common credentials include: **Username · Password · Access token · API credential · Certificate · Connection string containing authentication information**</p>
<pre>DATABASE_USER = app_user
DATABASE_PASSWORD = ********
DATABASE_HOST = db.example.com</pre>
<ul><li>Credentials should be treated as **sensitive information** because someone who obtains them may gain **unauthorized access** to the database.</li>
<li>Database credentials can provide **direct access** to application data.</li></ul>
<p>If an attacker obtains valid credentials, they may potentially: Read sensitive information · Modify records · Delete data · Create unauthorized accounts · Disrupt application operations · Extract confidential information.</p>
<ul><li>Therefore, database credentials should **not be treated like ordinary application configuration**.</li></ul>
<div class="trap">⚠️ Credentials should <b>NOT</b> be: Published on <b>GitHub</b> · Embedded in public <b>frontend JavaScript</b> · Included in <b>screenshots</b> · Shared through public <b>chat channels</b> · <b>Hard-coded</b> into publicly accessible source code.</div>`},
{h:"Environment Variables",sl:"1·50–52",b:`
<ul><li>An **environment variable** is a **named value** provided to an application through its **execution environment**.</li></ul>
<p>Instead of writing configuration directly into the source code: <code>DATABASE_PASSWORD = "secret"</code><br>the application can retrieve it from the environment:</p>
<pre>import os
password = os.getenv("DATABASE_PASSWORD")</pre>
<ul><li>The source code no longer needs to contain the **actual password**.</li>
<li>Environment variables can contain: **Database credentials, API keys, Application configuration, Service URLs, Environment-specific settings**.</li>
<li>Cloud deployment platforms commonly provide a way to configure environment variables through their **dashboards or deployment settings** (for example, **Vercel**).</li>
<li>The application retrieves the values **while running**.</li>
<li>Developers can deploy the **same application code** to different environments without placing secrets directly into the source files.</li></ul>
<div class="trap">⚠️ Environment variables help prevent secrets from being <b>hard-coded</b> into source code, but they do <b>not automatically make secrets secure</b>.</div>
<p>Developers must still: Restrict access to **deployment settings** · Avoid exposing variables in **application responses** · Avoid printing secrets in **logs** · Use **secure deployment platforms** · **Rotate** compromised credentials · Use dedicated **secrets-management systems** when appropriate.</p>
<ul><li>Environment variables are a **method of configuration and secret handling**—not a **replacement for security practices**.</li></ul>`},
{h:"What Is Data Validation?",sl:"1·53–56",b:`
<ul><li>**Data validation** is the process of checking whether submitted information meets the **requirements established by an application**.</li></ul>
<p>Validation can check: **Data type · Required fields · Length · Format · Range · Allowed values · Relationships between values**</p>
<div class="ex">Registration form: Name → <b>Required</b> · Age → <b>Integer</b> · Email → <b>Valid email format</b> · Password → <b>Minimum length</b></div>
<ul><li>Validation prevents invalid information from **unnecessarily reaching the database**.</li>
<li>Validation can occur in **multiple points**:</li>
<li>**Client validation** is performed in the **frontend** and it can provide **immediate feedback** to users.</li>
<li>**Server-side validation** is performed by the **backend**. Server-side validation is **essential** because users can **bypass frontend validation** by sending requests directly to the server.</li></ul>
<div class="hook">🧠 <b>Frontend validation improves user experience; backend validation protects application integrity.</b></div>
<ul><li>Validation protects the **quality of information** stored in the database.</li>
<li>Without validation, an application might accumulate Age values like 20, 19, "twenty", -5, 999, NULL — making the database difficult to use and analyze.</li>
<li>Good validation helps ensure that: Required information exists · Values follow expected formats · Data types are appropriate · Values fall within acceptable ranges · Invalid records are rejected **before storage**.</li>
<li>**Database constraints** can provide an **additional layer** of protection.</li></ul>
<h4>Validation vs. Security</h4>
<ul><li>Validation and security are **related, but they are not identical**.</li>
<li>Validation asks: “Is this data **acceptable according to the application's rules**?”</li>
<li>Security asks: “Can this user **perform this operation**, and can the input be **processed safely**?”</li></ul>
<p>Therefore, developers should combine: **Input validation · Authentication · Authorization · Secure database queries · Proper error handling · Database access controls**</p>`}
],
d:[
{h:"Protecting a Cloud Database",sl:"2·4",b:`
<ul><li>**Database security** involves protecting stored information from **unauthorized access, modification, disclosure, and destruction**.</li>
<li>Cloud databases may contain **personal information, customer records, payment-related data**, and other sensitive information.</li>
<li>A database should accept connections **only from authorized** applications, users, or services.</li>
<li>Security must cover both the **database infrastructure** and the way applications **access and process** stored data.</li>
<li>Using a managed database does **not remove** the application's responsibility to protect data.</li></ul>
<div class="hook">🧠 Protect from <b>A-M-D-D</b>: unauthorized <b>A</b>ccess, <b>M</b>odification, <b>D</b>isclosure, and <b>D</b>estruction.</div>`},
{h:"Essential Database Security Practices",sl:"2·5–6",b:`
<p>Developers should apply several fundamental protections when building cloud applications:</p>
<table class="t"><tr><th>Practice</th><th>Meaning</th></tr>
<tr><td>**Authentication**</td><td>Require valid credentials or an approved authentication mechanism.</td></tr>
<tr><td>**Least privilege**</td><td>Give each application account only the permissions it needs.</td></tr>
<tr><td>**Network restriction**</td><td>Limit database connections to trusted sources instead of exposing the database unnecessarily to the public internet.</td></tr>
<tr><td>**Encryption**</td><td>Protect sensitive data during transmission and, where appropriate, while stored.</td></tr>
<tr><td>**Secure queries**</td><td>Use parameterized queries to reduce the risk of SQL injection.</td></tr>
<tr><td>**Credential protection**</td><td>Keep passwords, connection strings, and other secrets out of public source code.</td></tr></table>
<div class="hook">🧠 <b>A-L-N-E-S-C</b> → “<b>A</b> <b>L</b>azy <b>N</b>inja <b>E</b>ats <b>S</b>ushi <b>C</b>arefully”.</div>
<div class="trap">⚠️ These practices <b>work together</b>. A strong password <b>alone</b> cannot protect a database that is unnecessarily exposed or grants excessive permissions.</div>`},
{h:"The App Must Enforce Secure Access",sl:"2·7",b:`
<div class="flow v"><span class="n u">USER</span><span class="ar">↓</span><span class="n fe">FRONTEND</span><span class="ar">↓</span><span class="n ap">BACKEND API</span><span class="ar">↓</span><span class="n st">Authenticate</span><span class="ar">↓</span><span class="n st">Check permissions</span><span class="ar">↓</span><span class="n st">Validate input</span><span class="ar">↓</span><span class="n st">Execute safe query</span><span class="ar">↓</span><span class="n db">DATABASE</span></div>
<ul><li>The **frontend** should normally communicate with the **backend API**, rather than connecting directly to a private database.</li>
<li>The **backend** should **authenticate** requests, check **authorization**, **validate** input, and execute database operations using **appropriate permissions**.</li>
<li>A user who can **view** a record should not automatically be allowed to **modify or delete** it.</li>
<li>Database errors and sensitive connection details should **not be exposed** to users.</li>
<li>**Parameterized queries** should be used instead of constructing SQL commands by combining query strings with **untrusted user input**.</li></ul>`},
{h:"Backups and Recovery",sl:"2·8–10",b:`
<ul><li>A **database backup** is a **copy of data** that can be used to restore information after **accidental deletion, corruption, system failure**, or other data-loss events.</li>
<li>Data can be lost because of **software errors, hardware failures, malicious activity, incorrect updates, or human mistakes**.</li>
<li>A database that is currently operating correctly is **not necessarily protected** against future data loss.</li>
<li>Backups provide a **recovery option**, but only if they are **retained securely** and can be **restored successfully**.</li>
<li>Backups should be protected from unauthorized access and, where appropriate, **encrypted**.</li></ul>
<table class="t"><tr><th>Backup option</th><th>Meaning</th></tr>
<tr><td>**Full backup or snapshot**</td><td>Captures a recoverable copy of the database at a particular point.</td></tr>
<tr><td>**Automated backup**</td><td>Runs according to a configured service schedule and retention policy.</td></tr>
<tr><td>**Point-in-time recovery (PITR)**</td><td>Allows restoration to a supported point in time, often using backups together with transaction logs.</td></tr>
<tr><td>**Manual backup**</td><td>A backup explicitly initiated or retained by an administrator or application team.</td></tr></table>
<ul><li>The available methods and retention periods **depend on the database service**.</li>
<li>For example, **Amazon RDS** supports automated backups and snapshots, and its point-in-time recovery capabilities depend on the configured backup features.</li></ul>
<div class="hook">🧠 <b>Backup</b> is the process of <b>preserving</b> data; <b>Recovery</b> is the process of <b>returning</b> data or service to a <b>usable state</b>.</div>
<ul><li>Recovery procedures should identify **which backup to use**, **who can initiate restoration**, and **how the application will reconnect** afterward.</li>
<li>Backup copies should be **stored and protected** so that the same incident does not destroy both the original data and its backups.</li>
<li>Organizations should **periodically test restoration** rather than assuming that a successful backup job guarantees successful recovery.</li>
<li>The appropriate **backup frequency** depends on how much data the organization can **afford to lose** and how **quickly** the service must return.</li></ul>`},
{h:"Database Availability",sl:"2·11",b:`
<ul><li>**Database availability** refers to the ability of a database to **accept requests** and **provide its services** when applications need them.</li>
<li>A database may become unavailable because of **hardware failure, network problems, software errors, maintenance, or resource exhaustion**.</li>
<li>**High availability (or Five Nines)** uses infrastructure and operational techniques to **reduce downtime** and help applications **continue operating** when failures occur.</li></ul>
<div class="trap">⚠️ <b>Availability is not the same as performance</b>: a database may be <b>reachable</b> but respond <b>too slowly</b> to meet application requirements.</div>
<ul><li>Cloud providers offer different availability features, but the level of protection depends on the **selected service and configuration**.</li></ul>`},
{h:"Replication, Redundancy, and Failover",sl:"2·12",b:`
<table class="t"><tr><th>Concept</th><th>Meaning</th></tr>
<tr><td>**Replication**</td><td>Copies data from one database instance to another, according to the system's replication method.</td></tr>
<tr><td>**Redundancy**</td><td>Provides additional resources or instances so that a single failure does not necessarily stop the service.</td></tr>
<tr><td>**Failover**</td><td>Switches database operations from a failed or unavailable primary instance to a functioning standby or replica.</td></tr></table>
<div class="hook">🧠 Replication = <b>copies</b> · Redundancy = <b>extra</b> · Failover = <b>switches</b>.</div>
<div class="ex">Example: a managed database may maintain a <b>primary instance</b> in one <b>availability zone</b> and a <b>standby instance</b> in another. If the primary fails, the service can initiate <b>failover</b> to the standby.</div>`},
{h:"Availability Is Not the Same as Backup",sl:"2·13–14",b:`
<ul><li>Replication and backups serve **different purposes**.</li>
<li>**Replication** helps maintain a **current copy** of data or supports continued service when an instance fails.</li>
<li>**Backups** preserve recoverable data from an **earlier point in time**.</li>
<li>If someone accidentally deletes important information, that deletion may **also be replicated** to other instances.</li>
<li>A **standby database** therefore does **not replace** a backup strategy.</li>
<li>Reliable database operations require **both** protection against service failures and a plan for recovering lost or corrupted data.</li></ul>
<h4>Recovery objectives</h4>
<table class="t"><tr><th>Objective</th><th>Meaning</th></tr>
<tr><td>**Recovery Time Objective (RTO)**</td><td>The target maximum **time** a service can remain **unavailable** after a disruption.</td></tr>
<tr><td>**Recovery Point Objective (RPO)**</td><td>The target maximum amount of **data loss** measured in time, such as the last five minutes of transactions.</td></tr></table>
<div class="ex">An application with an <b>RTO of 30 minutes</b> aims to restore service within that period. An <b>RPO of five minutes</b> means the recovery strategy should aim to limit data loss to approximately the last five minutes of updates.</div>
<div class="hook">🧠 RT<b>O</b> = <b>T</b>ime → how long it's <b>down</b>. RP<b>O</b> = <b>P</b>oint → how much <b>data</b> you lose.</div>
<ul><li>These objectives help teams decide how frequently to **back up data**, whether to use **standby instances**, and whether **cross-region disaster recovery** is necessary.</li></ul>`}
],
e:[
{h:"Introduction to Cloud Storage",sl:"2·16–17",b:`
<ul><li>**Cloud storage** allows applications and users to **store and retrieve data** using storage infrastructure **provided over a network**.</li>
<li>Data can remain available **without being stored directly** on a user's computer or the application's server.</li>
<li>Cloud storage is commonly used for **images, videos, documents, backups, logs, and application files**.</li>
<li>Storage **capacity, access controls, durability, and cost** depend on the service and its configuration.</li></ul>
<p>Good reasons why applications use cloud storages:</p>
<table class="t"><tr><th>Reason</th><th>Meaning</th></tr>
<tr><td>**Separation**</td><td>Application code and stored files can be managed independently.</td></tr>
<tr><td>**Capacity**</td><td>Storage can grow as an application's data increases.</td></tr>
<tr><td>**Accessibility**</td><td>Authorized applications and users can retrieve stored data over a network.</td></tr>
<tr><td>**Durability and protection**</td><td>Services may offer redundancy, versioning, or backup features, depending on configuration.</td></tr>
<tr><td>**Cost management**</td><td>Many services charge based on factors such as capacity, requests, and data transfer.</td></tr></table>
<div class="hook">🧠 <b>S-C-A-D-C</b> → “<b>S</b>oft <b>C</b>louds <b>A</b>re <b>D</b>rifting <b>C</b>almly”.</div>`},
{h:"The Three Storage Models",sl:"2·18",b:`
<p>There are **three storage models** that allow developers to organize their data:</p>
<ul><li>**File storage**: Organizes data into **files and folders**, similar to a **shared network drive**.</li>
<li>**Object storage**: Stores data as **objects** with **identifiers and metadata**, typically accessed through **APIs**.</li>
<li>**Block storage**: Presents data as a **volume of addressable blocks**, commonly used **like a disk** by a server or virtual machine.</li></ul>
<div class="trap">⚠️ The important difference is <b>not simply the type of file</b> being saved. It is <b>how the application or system organizes, accesses, and modifies</b> the stored data.</div>`},
{h:"Understanding Object Storage",sl:"2·19–20",b:`
<ul><li>**Object storage** stores data as **individual objects** rather than as traditional files on a disk or blocks in a volume.</li>
<li>An **object** typically contains **the data itself**, **metadata** describing it, and a **unique identifier or key**.</li>
<li>Objects are commonly organized within containers called **buckets** in services such as **Amazon S3** and **Google Cloud Storage**.</li>
<li>Applications generally access objects through **service APIs** or **HTTP-based requests**.</li>
<li>For example, an online store could store **product images** as objects and save each image's **URL or object key** in its product database.</li></ul>
<p>Object storage is well suited for:</p>
<ul><li>User-uploaded images, videos, and documents.</li><li>Static website assets and downloadable files.</li><li>Application logs, data archives, and large datasets.</li><li>Backups and other unstructured data.</li></ul>
<div class="trap">⚠️ It is <b>not a direct replacement</b> for every database or disk. Applications that require <b>frequent small changes</b> to parts of a file, or a disk volume with a <b>traditional filesystem</b>, may need another storage model.</div>`},
{h:"Understanding Block Storage",sl:"2·21–22",b:`
<ul><li>**Block storage** divides data into **fixed-size blocks** and presents them as a **storage volume** that a computer or virtual machine can use.</li>
<li>The **operating system** can format the volume with a **filesystem** or use it for applications that manage data directly.</li>
<li>Block storage is commonly used for **virtual machine disks, operating system drives, and database storage**.</li>
<li>It is often chosen for workloads that need **low-latency, frequent read/write** operations.</li>
<li>Think of block storage as a **cloud-provided disk** that a virtual machine can use much like a **physical hard drive**.</li></ul>
<table class="t"><tr><th>Use case</th><th>Meaning</th></tr>
<tr><td>**Virtual machines**</td><td>Operating systems, installed software, and application files.</td></tr>
<tr><td>**Database workloads**</td><td>Storage for database files that require frequent reads and writes.</td></tr>
<tr><td>**Business applications**</td><td>Systems that depend on consistent disk access and responsive performance.</td></tr>
<tr><td>**Application servers**</td><td>Persistent storage that remains available independently of the server's temporary runtime memory.</td></tr></table>
<div class="trap">⚠️ Block storage does <b>not automatically</b> provide a <b>shared folder</b> or a <b>complete database service</b>. The application or operating system must manage the data appropriately, and service-specific limits still apply.</div>`},
{h:"Comparing the Three Storage Models",sl:"2·23",b:`
<table class="t"><tr><th>Feature</th><th>File storage</th><th>Object storage</th><th>Block storage</th></tr>
<tr><td>Organization</td><td>**Folders and files**</td><td>**Objects with IDs and metadata**</td><td>**Addressable blocks in a volume**</td></tr>
<tr><td>Typical access</td><td>**File paths and file protocols**</td><td>**APIs and object keys**</td><td>**Disk or block-device operations**</td></tr>
<tr><td>Common uses</td><td>Shared documents, team folders, shared files</td><td>Images, videos, backups, archives</td><td>VM disks, databases, application volumes</td></tr>
<tr><td>Main strength</td><td>**Familiar file and folder access**</td><td>**Scalable storage for large amounts of data**</td><td>**Low-latency, frequent read/write access**</td></tr>
<tr><td>Example service</td><td>**Amazon EFS**</td><td>**Amazon S3**</td><td>**Amazon EBS**</td></tr></table>
<div class="hook">🧠 E<b>F</b>S = <b>F</b>ile · E<b>B</b>S = <b>B</b>lock · S3 = <b>buckets of objects</b>.</div>
<ul><li>**Performance, scalability, and pricing** depend on the specific service and configuration. These are **general tendencies**, not guarantees that every service in a category behaves identically.</li></ul>`},
{h:"Choosing the Right Storage for an App",sl:"2·24",b:`
<p>Consider an online shopping application:</p>
<table class="t"><tr><th>Need</th><th>Use</th></tr>
<tr><td>Product images</td><td>**Object storage** can hold image files while the **database stores their keys or URLs**.</td></tr>
<tr><td>Shared company documents</td><td>**File storage** can provide a shared folder structure for staff and authorized applications.</td></tr>
<tr><td>Application server disk</td><td>**Block storage** can provide persistent disk capacity for the virtual machine.</td></tr>
<tr><td>Product details and orders</td><td>A **database** stores structured records, rather than treating cloud storage as a replacement for database operations.</td></tr></table>
<ul><li>Choose based on **how the data must be accessed and managed**, the workload's **performance needs**, **sharing requirements**, **security**, **durability**, and **cost**.</li></ul>`}
]};
