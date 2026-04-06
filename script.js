const BLOG_STORAGE_KEY = "bilal_portfolio_blogs";
const SOCIAL_POSITION_KEY = "bilal_social_position";
const CONTACT_EMAIL = "bilalhussain1115@gmail.com";
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const CONTACT_ACTIVATION_URL = "https://formsubmit.co/el/xodifi";
const ADMIN_PASSWORD = "BilalAdmin2026!";
const ADMIN_SESSION_KEY = "bilal_admin_unlocked";

const defaultBlogs = [
  {
    id: "default-mvc",
    tag: ".NET Journey",
    title: "What working with ASP.NET MVC taught me",
    image: "",
    excerpt:
      "MVC helped me understand how to structure routes, views, and data flow more cleanly inside practical .NET web applications.",
    content:
      "Working with ASP.NET MVC gave me a much clearer understanding of structure inside web applications. Instead of only building pages, I started thinking more carefully about route flow, separation of concerns, reusable views, and cleaner backend-connected UI.\n\nThat shift was important for me because it moved my mindset from just making things look correct to making them behave correctly inside a larger application structure. It also connected well with the kind of business software thinking I already had from workflow-driven systems.",
    createdAt: "2026-04-06T09:00:00.000Z",
  },
  {
    id: "default-erp",
    tag: "ERP Workflow",
    title: "Understanding inventory flow from GRN to production",
    image: "",
    excerpt:
      "Workflow-based systems taught me that software has to respect how operations move in the real world, not just how screens look on paper.",
    content:
      "One of the most valuable things I learned from workflow-oriented software work is that business systems are not just a collection of forms. They represent movement, responsibility, timing, and process accuracy.\n\nIn inventory and ERP-related flow, a small mistake in stock movement, GRN handling, production issue logic, or returns can create confusion far beyond the screen where the action started. That is why I think carefully about data flow, state, and process order when I build software.",
    createdAt: "2026-04-06T09:15:00.000Z",
  },
  {
    id: "default-core",
    tag: "Learning",
    title: "Why I am currently focusing on ASP.NET Core",
    image: "",
    excerpt:
      "ASP.NET Core is the next step in my growth because I want to combine my .NET background with more modern web architecture and deployment-ready development.",
    content:
      "I am currently spending more time with ASP.NET Core because I want to deepen my ability to build modern web applications in a stronger, more scalable way.\n\nMy background already gave me good experience in C#, MVC thinking, WPF, workflow-based systems, and practical development. ASP.NET Core feels like the right direction to extend that foundation into modern backend work, cleaner APIs, and stronger full-stack capability.",
    createdAt: "2026-04-06T09:30:00.000Z",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSavedBlogs() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBlogs(blogs) {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
}

function getAllBlogs() {
  return [...getSavedBlogs(), ...defaultBlogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getBlogById(id) {
  return getAllBlogs().find((blog) => blog.id === id) || null;
}

function formatBlogDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatBlogContent(content) {
  return escapeHtml(content)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br />")}</p>`)
    .join("");
}

function renderBlogs() {
  const grid = document.getElementById("blogGrid");
  if (!grid) {
    return;
  }

  const blogs = getAllBlogs();
  if (!blogs.length) {
    grid.innerHTML =
      '<div class="blog-empty">No published posts yet. New writing will appear here once it is added through the admin page.</div>';
    return;
  }

  grid.innerHTML = blogs
    .map((blog) => {
      const safeTitle = escapeHtml(blog.title);
      const safeTag = escapeHtml(blog.tag);
      const safeExcerpt = escapeHtml(blog.excerpt);
      const safeImage = blog.image ? escapeHtml(blog.image) : "";
      const safeId = encodeURIComponent(blog.id);

      return `
        <article class="blog-card reveal">
          ${safeImage ? `<img src="${safeImage}" alt="${safeTitle}" class="blog-card__image" />` : ""}
          <span class="blog-card__tag">${safeTag}</span>
          <h3 class="blog-card__title">${safeTitle}</h3>
          <p class="blog-card__text">${safeExcerpt}</p>
          <div class="blog-card__actions">
            <a class="blog-card__link" href="blog.html?id=${safeId}">Read More</a>
            <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  setupRevealAnimations();
}

function renderBlogPostPage() {
  const container = document.getElementById("blogPost");
  if (!container) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");
  const blog = blogId ? getBlogById(blogId) : null;

  if (!blog) {
    container.innerHTML = `
      <div class="blog-post__empty">
        <span class="blog-card__tag">Blog</span>
        <h1 class="blog-post__title">Post not found</h1>
        <div class="blog-post__content"><p>This post could not be found. Head back to the blog section and choose another article.</p></div>
        <p style="margin-top:2rem;"><a href="index.html#blogs" class="btn btn--theme">Back To Blogs</a></p>
      </div>
    `;
    return;
  }

  const safeTitle = escapeHtml(blog.title);
  const safeTag = escapeHtml(blog.tag);
  const safeImage = blog.image ? escapeHtml(blog.image) : "";

  container.innerHTML = `
    <div class="blog-post__top">
      <span class="blog-card__tag">${safeTag}</span>
      <a href="index.html#blogs" class="btn btn--ghost">Back To Blogs</a>
    </div>
    ${safeImage ? `<img src="${safeImage}" alt="${safeTitle}" class="blog-post__image" />` : ""}
    <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
    <h1 class="blog-post__title">${safeTitle}</h1>
    <div class="blog-post__content">${formatBlogContent(blog.content)}</div>
  `;
}

function renderAdminPosts() {
  const list = document.getElementById("adminBlogList");
  if (!list) {
    return;
  }

  const savedBlogs = getSavedBlogs();
  if (!savedBlogs.length) {
    list.innerHTML =
      '<div class="admin-empty">No custom posts yet. Publish a post here and it will appear in your public blog section.</div>';
    return;
  }

  list.innerHTML = savedBlogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((blog) => `
      <article class="admin-post-card">
        <div>
          <span class="blog-card__tag">${escapeHtml(blog.tag)}</span>
          <h3 class="admin-post-card__title">${escapeHtml(blog.title)}</h3>
          <p class="admin-post-card__text">${escapeHtml(blog.excerpt)}</p>
          <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
        </div>
        <button class="admin-post-card__delete" data-delete-blog="${escapeHtml(blog.id)}" type="button">Delete</button>
      </article>
    `)
    .join("");
}

function setupAdminForm() {
  const form = document.getElementById("blogAdminForm");
  if (!form) {
    return;
  }

  renderAdminPosts();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("blogTitle")?.value.trim() || "";
    const tag = document.getElementById("blogTag")?.value.trim() || "";
    const image = document.getElementById("blogImage")?.value.trim() || "";
    const content = document.getElementById("blogContent")?.value.trim() || "";

    if (!title || !tag || !content) {
      return;
    }

    const blogs = getSavedBlogs();
    const excerpt = content.length > 180 ? `${content.slice(0, 177)}...` : content;

    blogs.unshift({
      id: `blog-${Date.now()}`,
      title,
      tag,
      image,
      content,
      excerpt,
      createdAt: new Date().toISOString(),
    });

    saveBlogs(blogs);
    form.reset();
    renderAdminPosts();

    const status = document.getElementById("adminStatus");
    if (status) {
      status.textContent = "Post published. Refresh the homepage blog section to view it publicly.";
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const blogId = target.getAttribute("data-delete-blog");
    if (!blogId) {
      return;
    }

    const remaining = getSavedBlogs().filter((blog) => blog.id !== blogId);
    saveBlogs(remaining);
    renderAdminPosts();

    const status = document.getElementById("adminStatus");
    if (status) {
      status.textContent = "Post deleted.";
    }
  });
}

function setupAdminGate() {
  const loginSection = document.getElementById("adminLogin");
  const protectedSection = document.getElementById("adminProtected");
  const accessForm = document.getElementById("adminAccessForm");
  const accessStatus = document.getElementById("adminAccessStatus");
  const logoutButton = document.getElementById("adminLogoutBtn");

  if (!loginSection || !protectedSection || !accessForm) {
    return;
  }

  const setUnlocked = (unlocked) => {
    if (unlocked) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      loginSection.hidden = true;
      protectedSection.hidden = false;
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      loginSection.hidden = false;
      protectedSection.hidden = true;
    }
  };

  setUnlocked(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");

  accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("adminPassword")?.value || "";

    if (password === ADMIN_PASSWORD) {
      if (accessStatus) {
        accessStatus.textContent = "Access granted.";
      }
      setUnlocked(true);
      accessForm.reset();
      return;
    }

    if (accessStatus) {
      accessStatus.textContent = "Incorrect password.";
    }
  });

  logoutButton?.addEventListener("click", () => {
    setUnlocked(false);
    if (accessStatus) {
      accessStatus.textContent = "Admin locked.";
    }
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupFloatingSocial() {
  const widget = document.getElementById("floatingSocial");
  const handle = document.getElementById("floatingHandle");
  if (!widget || !handle) {
    return;
  }

  const savedPosition = localStorage.getItem(SOCIAL_POSITION_KEY);
  if (savedPosition) {
    try {
      const { left, top } = JSON.parse(savedPosition);
      widget.style.left = `${left}px`;
      widget.style.top = `${top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
    } catch {
      // ignore invalid value
    }
  }

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMove = (event) => {
    if (!dragging) {
      return;
    }

    const maxLeft = window.innerWidth - widget.offsetWidth - 8;
    const maxTop = window.innerHeight - widget.offsetHeight - 8;
    const left = clamp(event.clientX - offsetX, 8, Math.max(8, maxLeft));
    const top = clamp(event.clientY - offsetY, 8, Math.max(8, maxTop));

    widget.style.left = `${left}px`;
    widget.style.top = `${top}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  };

  const onUp = () => {
    if (!dragging) {
      return;
    }

    dragging = false;
    widget.classList.remove("dragging");
    localStorage.setItem(
      SOCIAL_POSITION_KEY,
      JSON.stringify({
        left: parseFloat(widget.style.left || "16"),
        top: parseFloat(widget.style.top || "160"),
      })
    );
  };

  handle.addEventListener("pointerdown", (event) => {
    dragging = true;
    widget.classList.add("dragging");
    offsetX = event.clientX - widget.getBoundingClientRect().left;
    offsetY = event.clientY - widget.getBoundingClientRect().top;
    handle.setPointerCapture(event.pointerId);
  });

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("resize", onUp);
}

function fireNavImpact(link) {
  link.classList.remove("is-fired");
  void link.offsetWidth;
  link.classList.add("is-fired");

  const impact = document.createElement("span");
  impact.className = "nav-impact";
  impact.innerHTML = `
    <span class="nav-impact__flash"></span>
    <span class="nav-impact__bolt"></span>
    <span class="nav-impact__branch nav-impact__branch--one"></span>
    <span class="nav-impact__branch nav-impact__branch--two"></span>
  `;
  link.appendChild(impact);
  window.setTimeout(() => impact.remove(), 520);

  for (let index = 0; index < 5; index += 1) {
    const spark = document.createElement("span");
    spark.className = "nav-spark";
    spark.style.left = `${18 + index * 15}%`;
    spark.style.top = `${30 + (index % 2) * 16}%`;
    spark.style.animationDelay = `${index * 0.03}s`;
    link.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}

function prepareSectionTitle(title) {
  if (!title || title.dataset.fxReady === "true") {
    return;
  }

  const text = title.textContent.trim();
  title.textContent = "";

  [...text].forEach((character) => {
    if (character === " ") {
      const spacer = document.createElement("span");
      spacer.className = "section-title__space";
      spacer.textContent = "\u00A0";
      title.appendChild(spacer);
      return;
    }

    const charSpan = document.createElement("span");
    charSpan.className = "section-title__word";
    charSpan.textContent = character;
    charSpan.style.setProperty("--scatter-x", `${(Math.random() * 150 - 75).toFixed(0)}px`);
    charSpan.style.setProperty("--scatter-y", `${(-18 - Math.random() * 110).toFixed(0)}px`);
    charSpan.style.setProperty("--scatter-r", `${(Math.random() * 70 - 35).toFixed(0)}deg`);
    charSpan.style.setProperty("--fire-delay", `${(Math.random() * 0.45).toFixed(2)}s`);
    charSpan.setAttribute("role", "button");
    charSpan.setAttribute("tabindex", "0");
    title.appendChild(charSpan);
  });

  const reassemble = () => {
    title.classList.remove("is-scattered");
    title.classList.remove("is-smashed");
  };

  title.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("section-title__word")) {
      reassemble();
    }
  });

  title.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.classList.contains("section-title__word") &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      reassemble();
    }
  });

  title.dataset.fxReady = "true";
}

function strikeSectionTitle(section) {
  const title = section.querySelector(".section-title");
  if (!title) {
    return;
  }

  prepareSectionTitle(title);
  title.classList.remove("is-scattered");
  title.classList.remove("is-smashed");
  void title.offsetWidth;
  title.classList.add("is-scattered");
  title.classList.add("is-smashed");

  const existingThunder = title.querySelector(".title-thunder");
  if (existingThunder) {
    existingThunder.remove();
  }

  const thunder = document.createElement("span");
  thunder.className = "title-thunder";
  const strikeChars = [...title.querySelectorAll(".section-title__word")];
  const strikeIndex = strikeChars.length ? Math.max(0, Math.floor(strikeChars.length * 0.08)) : 0;
  const strikeLeft = strikeChars.length ? ((strikeIndex + 0.5) / strikeChars.length) * 100 : 50;
  thunder.style.setProperty("--strike-left", `${strikeLeft}%`);
  thunder.innerHTML = `
    <span class="title-thunder__flash"></span>
    <span class="title-thunder__fire" aria-hidden="true"></span>
    <svg class="title-thunder__svg" viewBox="0 0 180 220" aria-hidden="true">
      <path class="title-thunder__path" d="M84 0 L78 24 L90 44 L72 70 L86 94 L68 122 L80 148 L66 176 L74 220" />
      <path class="title-thunder__path title-thunder__path--branch-left" d="M78 28 L56 46 L62 68" />
      <path class="title-thunder__path title-thunder__path--branch-right" d="M84 88 L112 110 L102 136" />
      <path class="title-thunder__path title-thunder__path--branch-left title-thunder__path--branch-fine" d="M70 128 L50 152 L56 176" />
      <path class="title-thunder__path title-thunder__path--branch-right title-thunder__path--branch-faint" d="M88 42 L110 58 L104 80" />
    </svg>
  `;
  title.appendChild(thunder);
  window.setTimeout(() => {
    thunder.remove();
    title.classList.remove("is-smashed");
  }, 820);

  const existingSectionThunder = section.querySelector(".section-thunder");
  if (existingSectionThunder) {
    existingSectionThunder.remove();
  }

  const sectionThunder = document.createElement("span");
  sectionThunder.className = "section-thunder";
  sectionThunder.innerHTML = `
    <span class="section-thunder__flash"></span>
    <span class="section-thunder__image" aria-hidden="true"></span>
  `;
  section.appendChild(sectionThunder);
  window.setTimeout(() => sectionThunder.remove(), 760);
}

function setActiveNav(sectionId) {
  document.querySelectorAll(".nav-scroll-link").forEach((link) => {
    const target = link.getAttribute("data-target");
    link.classList.toggle("is-active", target === sectionId);
  });
}

function setupNavigation() {
  const navLinks = [...document.querySelectorAll(".nav-scroll-link")];
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  let pendingStrikeId = "";

  mobileMenuButton?.addEventListener("click", () => {
    const open = mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenuButton.setAttribute("aria-expanded", String(!open));
    if (mobileMenu) {
      mobileMenu.hidden = open;
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("data-target");
      const section = targetId ? document.getElementById(targetId) : null;
      if (!section) {
        return;
      }

      event.preventDefault();
      fireNavImpact(link);
      setActiveNav(targetId);

      if (mobileMenu && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        mobileMenuButton?.setAttribute("aria-expanded", "false");
      }

      const rect = section.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.18;

      if (alreadyVisible) {
        strikeSectionTitle(section);
      } else {
        pendingStrikeId = section.id;
      }

      window.setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 70);

      window.setTimeout(() => {
        if (pendingStrikeId === section.id) {
          strikeSectionTitle(section);
          pendingStrikeId = "";
        }
      }, 760);
    });
  });

  const sections = [...document.querySelectorAll("[data-section]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
          if (pendingStrikeId === entry.target.id) {
            strikeSectionTitle(entry.target);
            pendingStrikeId = "";
          }
        }
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupSectionTitleEffects() {
  document.querySelectorAll(".section-title").forEach((title) => prepareSectionTitle(title));
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) {
    return;
  }

  status.textContent =
    "Messages are configured to send to bilalhussain1115@gmail.com through FormSubmit. If delivery is not active yet, confirm the activation link once and test again.";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    if (!name || !email || !message) {
      status.textContent = "Please complete your name, email, and message before sending.";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    status.textContent = "Sending message...";

    try {
      const formData = new FormData(form);
      formData.set("name", name);
      formData.set("email", email);
      formData.set("message", message);
      formData.set("_subject", `Portfolio message from ${name}`);

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || "Unable to send message right now.");
      }

      form.reset();
      status.textContent =
        "Message sent. If this is your first live FormSubmit setup, make sure the activation link has already been confirmed in your email.";
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unable to send message right now.";
      status.innerHTML = `${messageText} If the form is not activated yet, open <a href="${CONTACT_ACTIVATION_URL}" target="_blank" rel="noreferrer">this FormSubmit activation link</a> once, then test again on the deployed site.`;
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}

renderBlogs();
renderBlogPostPage();
setupAdminGate();
setupAdminForm();
setupFloatingSocial();
setupSectionTitleEffects();
setupNavigation();
setupRevealAnimations();
setupContactForm();


