function born(reactor) {
    const player = find_parent(reactor);
    if (!player) { kill(reactor); return; }
    write_local(reactor, "owner", player.id);
}
