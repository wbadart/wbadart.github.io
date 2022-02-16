---
title: "Git Gud"
date: 2020-05-12T17:18:05-07:00
draft: true
---

Why should a client trust a model that came out of thin air? They
shouldn't! Yet in spite of our efforts, that's how even the most brilliant
models will look if we can't show how we made them. In this talk, we'll learn
use _git_ to craft a history of our model and, in the process, make our
analyses more manageable, repeatable, and credible.

<!--
- Why should I git gud?
- How do I git gud?
  - Work with more trackable forms
    - `nbdime`
    - Move from notebooks to modules
  - Realize every change is an artifact
    - Atomic commits
    - GitHub flow
  - Track your environment too
    - Requirements files and lock files
    - Docker
  - Realize every tweak is a trial
    - Write it down
    - Write it down in MLFlow
- What do I do, now that I got gud?
-->

## Why should I git gud?

Evolution in code is inevitable &mdash; you might say it's our job to evolve
code &mdash; but whether to actively manage that evolution is a choice.
Choosing to manage code evolution means _actively tracking changes_, and
tracking changes

1. enhances **credibility**: tracking changes boosts our credibility from two
   perspectives: from _explainability_ and from _replicability_. Having a
   written record of every tweak to the code base from 0 SLOC to today paints
   an unambiguous and objective picture of how the project (and the model it
   explores) got to its current state. This trail of breadcrumbs will make it
   easier for third parties to reproduce your results; a key property for a
   proper scientific engagement.
2. protects your **sanity**: never again wonder "how the hell did I get here?"
   Stakeholders and collaborators aren't the only ones who can leverage your
   commit history. Not only does it let you read the project's history, it lets
   you interact with it and rewind to any point in time you like (such as a
   time before that bug you just introduced).
3. promotes **collaboration**: the world's premier code sharing platforms are
   all based on git. A properly tracked and configured project is never more
   than three commands away from being run on your teammate's machine.
   Moreover, git gives you a principled way to combine changes from many
   sources (read: from many teammates).
   
As we learn the tool together over the next half hour, we'll see these three
themes come up again and again, and we'll see through examples how git really
does enhance our projects (and our lives) along these axes.

## How do I git gud?

The first step to gitting gud is simply to learn the tool. A full git tutorial
is unfortunately out of scope for this talk, but there are tons of resources
online. I will call out _{{< extref "Git - The Simple Guide"
"https://rogerdudler.github.io/git-guide" >}}_: a command cheat sheet with
installation links, and _{{< extref "Learn Git Branching"
"https://learngitbranching.js.org" >}}_: a great, interactive tutorial for
building up visual intuitions around git workflows.

[simple guide]: https://rogerdudler.github.io/git-guide
[learn branching]: https://learngitbranching.js.org

Long story short, git tracks the history of your code through a series of
_commits_. A commit is simply a set of code changes with a message attached; a
sentence in the story of your model. For example, I might add a shuffling step
to my preprocessing pipeline. Might look something like this:

```diff
commit 990e1d429680297fd2c1c44cf17c82a4254d200e
Author: Will Badart <badart_william@bah.com>
Date:   Wed May 13 19:33:23 2020 -0700

    Add shuffling to preprocessing pipeline
    
    My advanced solution helps prevent overfitting by randomizing the
    dataset each run, before partitioning it.

diff --git a/preprocess.py b/preprocess.py
index 7fc7534..a157c89 100644
--- a/preprocess.py
+++ b/preprocess.py
@@ -1,10 +1,12 @@
 import pandas as pd
 from sklearn.model_selection import train_test_split
 from sklearn.preprocessing import MinMaxScaler
+from sklearn.utils import shuffle
 
 def preprocess(df):
     """Apply my super fancy preprocessing pipeline to the DataFrame."""
+    df = shuffle(df)
     y = df.pop("label")
     X = df.values
     scaler = MinMaxScaler()
```

Each one of these commits describes an incremental change to the project. It
takes time and practice to craft sharp, focused commits &mdash; both the
message and the change set itself must be carefully constructed &mdash; but
once you have the hang of it, they'll help you quickly understand how a
particular part of the project came to be. For example, here's an actual list
of commits from a project I'm working on right now:

- `4da007c` First pass at variable-sized benchmarking runs
- `b1e6c61` Try Benchmarking matrix
- `9c81e46` Try to actually run benchmarking matrix
- `7cfd10d` Retry failing GPU benchmark jobs
- `e45b68d` Drop biggest test case
- `17d4920` Revise x-axis values
- `33f1cc6` Run each device/ size cell 4 times, plot mean
- `fdaca8b` Plot means with data points in the background
- `ab87ee0` Combine axes_plot parameters for color
- `c283dc9` Makefile: cleanup benchmark results on failure
- `8060164` Corrected jenkins comparison artifacts

The summary of each message alone tells a pretty complete story of how the
feature in question came to be; along with the change sets associated with each
commit, there is no room for ambiguity in the development story.

Now, you may know from experience, or have inferred from the above example,
that git tracks changes by _line_. For example, in the preprocessing example
above, the diff showed us that two lines had been added to the file: an
`import` and a call to `shuffle`.

This is a remarkably powerful approach for tracking git's original target,
source code (specifically, the source code of the {{< extref "Linux kernel"
"https://en.wikipedia.org/wiki/Git#History" >}}), but we aren't always working
with straight code. Notebooks are particularly challenging. They might make you
feel like you're working with regular, raw code, as you write up your input
cells one line at a time (or several at a time if you're copying code from
StackOverflow), but under the hood there's a lot more going on. To give you a
sense of the challenge, I created and committed an empty notebook.  Then I
added once cell containing the code:

```python
print("Hello world!")
```

The change set from adding one line of code was 56 lines long:

```diff
diff --git a/Hello World.ipynb b/Hello World.ipynb
index 7fec515..6cd9078 100644
--- a/Hello World.ipynb	
+++ b/Hello World.ipynb	
@@ -1,6 +1,49 @@
 {
- "cells": [],
- "metadata": {},
+ "cells": [
+  {
+   "cell_type": "code",
+   "execution_count": 1,
+   "metadata": {},
+   "outputs": [
+    {
+     "name": "stdout",
+     "output_type": "stream",
+     "text": [
+      "Hello world!\n"
+     ]
+    }
+   ],
+   "source": [
+    "print(\"Hello world!\")"
+   ]
+  },
+  {
+   "cell_type": "code",
+   "execution_count": null,
+   "metadata": {},
+   "outputs": [],
+   "source": []
+  }
+ ],
+ "metadata": {
+  "kernelspec": {
+   "display_name": "Python 3",
+   "language": "python",
+   "name": "python3"
+  },
+  "language_info": {
+   "codemirror_mode": {
+    "name": "ipython",
+    "version": 3
+   },
+   "file_extension": ".py",
+   "mimetype": "text/x-python",
+   "name": "python",
+   "nbconvert_exporter": "python",
+   "pygments_lexer": "ipython3",
+   "version": "3.8.2"
+  }
+ },
  "nbformat": 4,
  "nbformat_minor": 4
 }
```

If someone stuck this in front of you and asked you to review it, you'd be well
within your right to tell them off. Clearly, in this state, git is not helping
our sanity. Lucky for us, there are a few ways we can meet git in the middle.

### nbdime

In my experience, the best band-aid for this problem is {{< extref "nbdime"
"https://nbdime.readthedocs.io/en/latest/index.html" >}}. nbdime renders the
above 56-line diff as:

![nbdiff-web](/img/nbdiff-web.png)

This brings the _actually interesting_ changes to the forefront.

### Work with more trackable forms

We'll get decent mileage in terms of diff readability from nbdime, but it
doesn't address the underlying problem, namely, that notebook diffs have a lot
of noise. This is one of several reasons that notebooks aren't the ideal medium
for doing your project's heaving lifting. In addition to being harder to track,
notebooks freeze your code; the only way to use code you write in a notebook is
to run the notebook. Except through buggy and unreliable means, the code can't
be extracted and tested or reused. After all, notebooks are a reporting tool,
[not an IDE]({{< ref "posts/notebook-driven-ds.md" >}}).

We've already seen that git excels with regular source code, so let's try that
instead! The recommendation is remarkably simple: **move the bulk of your code
to `.py` files.** A notebook shouldn't implement a library, but instead import
one and communicate the results of its use through prose and visualization.

The immediate result of this shift is that you'll be forced to organize your
code into individual functions with descriptive names (and maybe even some
documentation). If you didn't do this, you wouldn't have any handle on your
code to import into the notebook. Ultimately, I've just tricked you into
writing a library. That might sound like a lot of effort, but it's actually the
best thing that's ever happened to your project; now that most of your code
lives in Yet Another Python Library&trade;, you can apply all of the plain old
development processes to it. Test it, lint it, document it, package it up and
use it on your next project. Can your notebook do that?

### Realize every change is an artifact

We might be tempted to think that a trained model is the only artifact of our
project. There's no denying that this model was the ultimate goal of the
project, but [...].

#### Atomic commits

When we think about a piece of code, it's easiest if we can think of that code
in its own right, in isolation, without having to drudge it up from a tangle of
other ideas. The same applies to change sets. _In these uncertain times_, when
asynchronous communication and collaboration are more prevalent than ever,
reviewing change sets directly will be one of the primary ways your teammates
interact with your contributions.

{{< extref "Atomic commits"
"https://curiousprogrammer.io/blog/why-i-create-atomic-commits-in-git" >}}

Up until now, we've talked almost exclusively about commits. We now need to
introduce another important construct: the _branch_. A branch is a bookmark
that can hold our place at a specific commit. Every repository I've ever seen,
and every repository I'll ever see, has at least one branch, called `master`,
which represents something like the canonical or "accepted" state of the repo.
In a typical workflow, you want to make some change to the code in `master`:
maybe you need to fix a bug or add a feature. To get started, you create a new
branch, called a "feature branch" and start writing commits to it. When your
fix or feature is finished, you can share that branch with your teammates for
them to review and test. If everyone signs off, then that branch is _merged_
into `master`, applying all the changes you committed on the feature branch to
`master`.

This simple "feature branch workflow" is the basis of several popular, more
complex workflows, most notably {{< extref "Git Flow"
"https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow"
>}}. Most of the time, a feature branch is all you need. This model allows
teammates to easily share and review changes with each other and to
collectively maintain code quality on `master`, the "main" version of the code.

### Track your environment too

Your results are more than the sum of their source code. They are equally (and
implicitly) dependent on your compute environment. Therefore, being able to
reproduce results entails being able to reproduce the environment. The
challenge is that an “environment,” unlike the raw text of a source file, is a
rather abstract thing, encompassing the libraries used, their versions, your
Python installation, the state of the file system, and even the hardware used.
The complexity and importance of this challenge has led to a plethora of
solutions.

#### Requirements files and lock files

The most widespread way to track Python dependencies is the humble {{< extref
"requirements file"
"https://pip.pypa.io/en/latest/user_guide/#requirements-files" >}}. You don't
need any extra tools. Whenever you `pip install` something, just append the
name of the package to `requirements.txt`. The nice thing about keeping a
`requirements.txt` is that anyone else working in the ecosystem will understand
what it's saying. For a more aggressive record of your dependencies, run

```sh
pip freeze > requirements.txt
```

to capture your dependencies _as well as_ your dependencies' dependencies (and
the exact version of all of the above). This turns your requirements file,
functionally. By pinning the version of all the needed packages, you've turned
your requirements file into a lock file.

It's good, especially in data science, where we're concerned with
reproducibility, to keep a lock file with exact version of every package we
used, so we can be more sure that others are really running the same underlying
code. However, we've muddied the waters by dumping our dependencies'
dependencies into the file. We lost our documentation of which packages we rely
on directly.

More modern tools like {{< extref "Poetry" "https://python-poetry.org" >}} let
us have our cake and eat it too.


#### Docker

Rather than detailing the options, allow me to explain the single approach I've
found to be the most broadly applicable and have the best power-to-weight
ratio: write a Dockerfile and create a container.

A Docker container is essentially a diet virtual machine which can be run on
any host with the Docker runtime. This works because a container is, as the
name suggests, self-contained; we completely specify the needed operating
system, libraries, packages, and setup steps in a Dockerfile. For example, if
we've been good and maintained a requirements file we can write:

```dockerfile
FROM python:3.7
WORKDIR /src
COPY . .
RUN pip install -r requirements.txt notebook
CMD jupyter notebook --allow-root
```

Anyone interested in recreating our results need only run:

```sh
docker build -t experiment:v1 .
docker run -p 8080:8080 experiment:v1
```

They will then be able to freely re-run our notebooks against the same OS, the
same Python version, the same libraries, the same files as ours; in an
environment which, for all intents and purposes, is identical to ours.
Suddenly, the reproduction of our environment goes from daunting and ad-hoc to
trivial and mechanical, greatly boosting our reproducibility and thusly impact.

Remarkably, those 5 lines of Dockerfile have made our analysis cloud-ready for
free. After running the above docker build command, one little docker push can
send your analysis to an AWS container registry, where it can be picked up and
run, for example, by Fargate. With almost no overhead, we've enabled
innumerable highly-scalable deployment options for our client.

### Realize every tweak is a trial

One of the reasons tracking changes can be especially challenging in data
science is the sheer volume of changes. Every tweak of a hyperparameter, every
adjustment to the architecture, constitutes a trial in the experiment that is
your project. And guess what: you're a scientist, so **you have to write them
down.**

Obviously, it would be wildly inefficient and downright inconvenient to produce
a writeup every time we re-run a notebook with slightly different values. The
_least_ we can do is commit the results of important trials, such as those that
lead to dramatic performance increases. Luckily for us, there are other, more
mechanical ways to record these runs.

#### Write it down in MLFlow

Go open up a notebook where you train a model. Run the cell

```python
!pip install mlflow
```

No look at each of the parameters of the notebook. These will be the model's
hyperparameters, like `MAX_DEPTH` or `CRITERION` (for a scikit-learn decision
tree) and variables that control the training routing, like `NUM_EPOCHS` for a
neural network. Wherever you set these, add the line:

```python
mlflow.log_parameter("PARAM_NAME", PARAM_VALUE)
```

Next, look at where you compute interesting metrics, like training accuracy, or
the f1-score on the validation set. After each of these, add a line like:

```python
mlflow.log_metric("METRIC_NAME", METRIC_VALUE)
```

And now you can fire and forget! Tune away, mess with the hyperparameters,
re-run your notebook like crazy, whatever you want.

What's that? You don't remember which combination gave you the best testing
precision? Just run `mlflow ui` in your terminal and pop open `localhost:5000`
for your answer.

## What do I do, now that I got gud?
